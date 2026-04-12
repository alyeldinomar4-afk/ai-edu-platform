import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, SkipBack, SkipForward, Zap, Layout, Monitor, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ContextualAI from '../ai/ContextualAI';

const SAMPLE_VIDEO = 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4';
const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const VideoPlayer = ({ src, title, onStateChange, markers = [], isTheaterMode, onToggleTheaterMode, aiMessages = [], isAiTyping, onAiAsk }) => {
    const { t, i18n } = useTranslation();
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
    const [showFsAi, setShowFsAi] = useState(false);

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
        const handleFsChange = () => {
            const isFs = !!document.fullscreenElement;
            setIsFullscreen(isFs);
            if (!isFs) {
                setShowFsAi(false);
            }
        };
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    const toggleAiSidebar = () => {
        const newShowFsAi = !showFsAi;
        setShowFsAi(newShowFsAi);

        // Auto-pause if opening sidebar and video is playing
        if (newShowFsAi && isFullscreen && isPlaying) {
            togglePlay();
        }
    };

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
                case 't':
                    if (onToggleTheaterMode) onToggleTheaterMode();
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
            className={`relative bg-black rounded-xl overflow-hidden aspect-video group select-none flex transition-all duration-500 ease-in-out ${isFullscreen ? 'rounded-none w-screen h-screen' : ''}`}
            onMouseMove={resetControlsTimeout}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* Video & Controls Area */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden h-full">
                {/* Video Element */}
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

                {/* Click-catcher */}
                <div
                    className="absolute inset-0 z-[5] cursor-pointer"
                    onClick={togglePlay}
                />

                {/* Big Center Play Button & AI Indicator */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10 pointer-events-none transition-all duration-700 ease-in-out ${!isPlaying ? 'opacity-100' : 'opacity-0 scale-105'}`}>
                    <div className={`mb-6 flex flex-col items-center transition-all duration-700 delay-100 ${!isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="flex items-center gap-2 px-6 py-2.5 bg-purple-600/30 backdrop-blur-xl border border-purple-400/40 rounded-full mb-6 shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-pulse">
                            <Zap className="w-5 h-5 text-purple-300 fill-purple-300/20" />
                            <span className="text-xs md:text-sm font-black text-white uppercase tracking-[0.2em] drop-shadow-sm">{t('videoPlayer.aiAnalyzing')}</span>
                        </div>
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300">
                            <Play className="w-10 h-10 md:w-12 md:h-12 text-white ml-2 opacity-90 drop-shadow-lg" />
                        </div>
                    </div>
                </div>

                {/* Controls Overlay */}
                <div
                    className={`absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 z-20 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    {/* Progress Bar */}
                    <div
                        ref={progressRef}
                        className="group/progress h-1.5 hover:h-2.5 bg-white/20 rounded-full mb-3 cursor-pointer transition-all duration-150 relative"
                        onMouseDown={handleSeekStart}
                    >
                        <div className="absolute top-0 left-0 h-full bg-white/30 rounded-full pointer-events-none" style={{ width: `${bufferedProgress}%` }} />
                        <div className="absolute top-0 left-0 h-full bg-primary rounded-full pointer-events-none" style={{ width: `${progress}%` }}>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform border-2 border-white" />
                        </div>
                        {duration > 0 && markers.map((time, i) => (
                            <div key={i} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none z-10" style={{ left: `${(time / duration) * 100}%` }}>
                                <div className="relative w-3 h-3">
                                    <div className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-75" />
                                    <div className="relative rounded-full w-3 h-3 bg-purple-400" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-1 md:gap-3">
                            <button onClick={togglePlay} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                            </button>
                            <button onClick={() => skip(-10)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer hidden sm:block"><SkipBack className="w-4 h-4" /></button>
                            <button onClick={() => skip(10)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer hidden sm:block"><SkipForward className="w-4 h-4" /></button>
                            <div className="relative flex items-center" onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
                                <button onClick={toggleMute} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                                <div className={`overflow-hidden transition-all duration-200 ${showVolumeSlider ? 'w-20 ml-1 opacity-100' : 'w-0 opacity-0'}`}>
                                    <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-full h-1 accent-primary cursor-pointer" />
                                </div>
                            </div>
                            <div className="text-xs md:text-sm font-medium tabular-nums ml-1">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </div>
                        </div>

                        <div className="flex items-center gap-1 md:gap-2">
                            <div className="relative">
                                <button onClick={() => setShowSettings(!showSettings)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1">
                                    <Settings className="w-5 h-5" />
                                    {playbackSpeed !== 1 && <span className="text-xs font-bold">{playbackSpeed}x</span>}
                                </button>
                                {showSettings && (
                                    <div className="absolute bottom-full right-0 mb-2 bg-slate-900/95 backdrop-blur-sm rounded-xl border border-white/10 py-2 min-w-[140px] shadow-2xl">
                                        <div className="px-3 py-1.5 text-xs text-slate-400 font-semibold">{t('videoPlayer.playbackSpeed')}</div>
                                        {PLAYBACK_SPEEDS.map(speed => (
                                            <button key={speed} onClick={() => changeSpeed(speed)} className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between ${playbackSpeed === speed ? 'text-primary font-bold' : 'text-white'}`}>
                                                <span>{speed === 1 ? t('videoPlayer.normal') : `${speed}x`}</span>
                                                {playbackSpeed === speed && <span className="text-primary">✓</span>}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {isFullscreen && (
                                <button
                                    onClick={toggleAiSidebar}
                                    className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${showFsAi ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'hover:bg-white/10 text-white'}`}
                                    title={t('videoPlayer.aiTutor.title')}
                                >
                                    <Zap className={`w-5 h-5 ${showFsAi ? 'fill-white' : ''}`} />
                                </button>
                            )}


                            <button onClick={onToggleTheaterMode} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer hidden lg:flex">
                                {isTheaterMode ? <Layout className="w-5 h-5 text-primary" /> : <Monitor className="w-5 h-5" />}
                            </button>
                            <button onClick={toggleFullscreen} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Sidebar Overlay */}
            <AnimatePresence>
                {isFullscreen && showFsAi && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: isFullscreen ? (window.innerWidth > 768 ? 400 : 320) : 0, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="h-full bg-[#0F172A] border-l border-white/10 z-[200] shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Sidebar Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-purple-400" />
                                <span className="font-bold text-white text-sm">{t('videoPlayer.aiTutor.title')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <AnimatePresence mode="wait">
                                    {isPlaying ? (
                                        <motion.div
                                            key="watching"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 rounded-full border border-green-500/20"
                                        >
                                            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                                            <span className="text-[9px] font-bold text-green-500 uppercase tracking-tighter whitespace-nowrap">{t('videoPlayer.aiTutor.watchingWithYou', { defaultValue: 'WATCHING' })}</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="paused"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-400/10 rounded-full border border-yellow-400/20"
                                        >
                                            <div className="flex items-center justify-center">
                                                <Pause size={10} className="text-yellow-400 fill-yellow-400" />
                                            </div>
                                            <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-tighter whitespace-nowrap">{t('videoPlayer.aiTutor.paused')}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <button onClick={() => setShowFsAi(false)} className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* AI Chat Component */}
                        <div className="flex-1 overflow-hidden">
                            <ContextualAI
                                videoState={{ currentTime, isPlaying }}
                                addMarker={null}
                                messages={aiMessages}
                                onSend={onAiAsk}
                                isTyping={isAiTyping}
                                hideHeader={true}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VideoPlayer;
