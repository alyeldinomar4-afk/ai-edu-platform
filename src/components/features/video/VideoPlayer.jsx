import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, SkipBack, SkipForward, Zap } from 'lucide-react';

const SAMPLE_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4';
const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const VideoPlayer = ({ src, title, onStateChange, markers = [] }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);
    const progressRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const videoSrc = src || SAMPLE_VIDEO;

    // ─── Auto-hide controls ───────────────────────────────
    const resetControlsTimeout = useCallback(() => {
        setShowControls(true);
        clearTimeout(controlsTimeoutRef.current);
        if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
                setShowSettings(false);
                setShowVolumeSlider(false);
            }, 3000);
        }
    }, [isPlaying]);

    useEffect(() => {
        resetControlsTimeout();
        return () => clearTimeout(controlsTimeoutRef.current);
    }, [isPlaying, resetControlsTimeout]);

    // ─── Play / Pause ─────────────────────────────────────
    const togglePlay = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
            setHasStarted(true);
            onStateChange?.({ isPlaying: true });
        } else {
            video.pause();
            setIsPlaying(false);
            onStateChange?.({ isPlaying: false });
        }
    }, [onStateChange]);

    // ─── Mute / Unmute ────────────────────────────────────
    const toggleMute = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    }, []);

    // ─── Volume Change ────────────────────────────────────
    const handleVolumeChange = useCallback((e) => {
        const video = videoRef.current;
        if (!video) return;
        const newVolume = parseFloat(e.target.value);
        video.volume = newVolume;
        setVolume(newVolume);
        if (newVolume === 0) {
            video.muted = true;
            setIsMuted(true);
        } else if (video.muted) {
            video.muted = false;
            setIsMuted(false);
        }
    }, []);

    // ─── Seek (click on progress bar) ─────────────────────
    const handleProgressClick = useCallback((e) => {
        const video = videoRef.current;
        const bar = progressRef.current;
        if (!video || !bar) return;
        const rect = bar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
    }, []);

    // ─── Seek (drag) ──────────────────────────────────────
    const handleSeekStart = useCallback((e) => {
        setIsSeeking(true);
        handleProgressClick(e);
    }, [handleProgressClick]);

    const handleSeekMove = useCallback((e) => {
        if (!isSeeking) return;
        handleProgressClick(e);
    }, [isSeeking, handleProgressClick]);

    const handleSeekEnd = useCallback(() => {
        setIsSeeking(false);
    }, []);

    // Global mouse events for dragging
    useEffect(() => {
        if (isSeeking) {
            const onMove = (e) => {
                const video = videoRef.current;
                const bar = progressRef.current;
                if (!video || !bar) return;
                const rect = bar.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                video.currentTime = pos * video.duration;
            };
            const onUp = () => setIsSeeking(false);
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
            return () => {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
            };
        }
    }, [isSeeking]);

    // ─── Fullscreen ───────────────────────────────────────
    const toggleFullscreen = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;
        if (!document.fullscreenElement) {
            container.requestFullscreen?.() || container.webkitRequestFullscreen?.();
        } else {
            document.exitFullscreen?.() || document.webkitExitFullscreen?.();
        }
    }, []);

    useEffect(() => {
        const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    // ─── Playback Speed ───────────────────────────────────
    const changeSpeed = useCallback((speed) => {
        const video = videoRef.current;
        if (!video) return;
        video.playbackRate = speed;
        setPlaybackSpeed(speed);
        setShowSettings(false);
    }, []);

    // ─── Skip forward/back ────────────────────────────────
    const skip = useCallback((seconds) => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
    }, []);

    // ─── Video events ─────────────────────────────────────
    const handleTimeUpdate = useCallback(() => {
        const video = videoRef.current;
        if (!video || isSeeking) return;
        setCurrentTime(video.currentTime);
        onStateChange?.({ currentTime: video.currentTime });
    }, [isSeeking, onStateChange]);

    const handleLoadedMetadata = useCallback(() => {
        const video = videoRef.current;
        if (video) setDuration(video.duration);
    }, []);

    const handleProgress = useCallback(() => {
        const video = videoRef.current;
        if (video && video.buffered.length > 0) {
            setBuffered(video.buffered.end(video.buffered.length - 1));
        }
    }, []);

    const handleVideoEnd = useCallback(() => {
        setIsPlaying(false);
        setShowControls(true);
        onStateChange?.({ isPlaying: false });
    }, [onStateChange]);

    // ─── Keyboard shortcuts ───────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger if user is typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'm':
                    toggleMute();
                    break;
                case 'f':
                    toggleFullscreen();
                    break;
                case 'arrowleft':
                    skip(-10);
                    break;
                case 'arrowright':
                    skip(10);
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [togglePlay, toggleMute, toggleFullscreen, skip]);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    const bufferedProgress = duration > 0 ? (buffered / duration) * 100 : 0;

    return (
        <div
            ref={containerRef}
            className={`relative bg-black rounded-xl overflow-hidden aspect-video group select-none ${isFullscreen ? 'rounded-none' : ''}`}
            onMouseMove={resetControlsTimeout}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* Video Element — no onClick here! */}
            <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onProgress={handleProgress}
                onEnded={handleVideoEnd}
                playsInline
                preload="metadata"
            />

            {/* Click-catcher: transparent layer for click-to-play/pause on video area */}
            <div
                className="absolute inset-0 z-[5] cursor-pointer"
                onClick={togglePlay}
            />

            {/* Big Center Play Button & AI Indicator (when paused) */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10 pointer-events-none transition-all duration-700 ease-in-out ${!isPlaying ? 'opacity-100' : 'opacity-0 scale-105'}`}>
                {/* Pulsing AI Indicator */}
                <div className={`mb-6 flex flex-col items-center transition-all duration-700 delay-100 ${!isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex items-center gap-2 px-6 py-2.5 bg-purple-600/30 backdrop-blur-xl border border-purple-400/40 rounded-full mb-6 shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-pulse">
                        <Zap className="w-5 h-5 text-purple-300 fill-purple-300/20" />
                        <span className="text-xs md:text-sm font-black text-white uppercase tracking-[0.2em] drop-shadow-sm">AI IS ANALYZING THIS MOMENT...</span>
                    </div>
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300">
                        <Play className="w-10 h-10 md:w-12 md:h-12 text-white ml-2 opacity-90 drop-shadow-lg" />
                    </div>
                </div>
            </div>

            {/* Controls Overlay — pointer-events-auto so buttons work and block the click-catcher */}
            <div
                className={`absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 z-20 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
            >
                {/* Progress Bar */}
                <div
                    ref={progressRef}
                    className="group/progress h-1.5 hover:h-2.5 bg-white/20 rounded-full mb-3 cursor-pointer transition-all duration-150 relative"
                    onMouseDown={handleSeekStart}
                >
                    {/* Buffered */}
                    <div
                        className="absolute top-0 left-0 h-full bg-white/30 rounded-full pointer-events-none"
                        style={{ width: `${bufferedProgress}%` }}
                    />
                    {/* Progress */}
                    <div
                        className="absolute top-0 left-0 h-full bg-primary rounded-full pointer-events-none"
                        style={{ width: `${progress}%` }}
                    >
                        {/* Thumb */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform border-2 border-white" />
                    </div>

                    {/* AI Markers */}
                    {duration > 0 && markers.map((time, i) => (
                        <div
                            key={i}
                            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)] border border-white/20 pointer-events-none z-10"
                            style={{ left: `${(time / duration) * 100}%` }}
                        />
                    ))}
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between text-white">
                    {/* Left Controls */}
                    <div className="flex items-center gap-1 md:gap-3">
                        <button
                            onClick={togglePlay}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                        >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={() => skip(-10)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer hidden sm:block"
                            title="Rewind 10s (←)"
                        >
                            <SkipBack className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => skip(10)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer hidden sm:block"
                            title="Forward 10s (→)"
                        >
                            <SkipForward className="w-4 h-4" />
                        </button>

                        {/* Volume */}
                        <div
                            className="relative flex items-center"
                            onMouseEnter={() => setShowVolumeSlider(true)}
                            onMouseLeave={() => setShowVolumeSlider(false)}
                        >
                            <button
                                onClick={toggleMute}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                            >
                                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                            <div className={`overflow-hidden transition-all duration-200 ${showVolumeSlider ? 'w-20 ml-1 opacity-100' : 'w-0 opacity-0'}`}>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-full h-1 accent-primary cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Time */}
                        <div className="text-xs md:text-sm font-medium tabular-nums ml-1">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-1 md:gap-2">
                        {/* Settings (Playback Speed) */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSettings(prev => !prev)}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                title="Settings"
                            >
                                <Settings className="w-5 h-5" />
                                {playbackSpeed !== 1 && (
                                    <span className="text-xs font-bold">{playbackSpeed}x</span>
                                )}
                            </button>
                            {showSettings && (
                                <div className="absolute bottom-full right-0 mb-2 bg-slate-900/95 backdrop-blur-sm rounded-xl border border-white/10 py-2 min-w-[140px] shadow-2xl">
                                    <div className="px-3 py-1.5 text-xs text-slate-400 font-semibold">Playback Speed</div>
                                    {PLAYBACK_SPEEDS.map(speed => (
                                        <button
                                            key={speed}
                                            onClick={() => changeSpeed(speed)}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between ${playbackSpeed === speed ? 'text-primary font-bold' : 'text-white'
                                                }`}
                                        >
                                            <span>{speed === 1 ? 'Normal' : `${speed}x`}</span>
                                            {playbackSpeed === speed && <span className="text-primary">✓</span>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fullscreen */}
                        <button
                            onClick={toggleFullscreen}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
                        >
                            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
