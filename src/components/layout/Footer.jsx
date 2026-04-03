import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';

const Footer = () => {
    const { t } = useTranslation();

    const platformLinks = [
        { name: t('nav.courses'), path: '/courses' },
        { name: t('nav.instructors'), path: '/instructors' },
        { name: t('nav.aiDemo'), path: '/ai-demo' },
    ];

    const legalLinks = [
        { name: t('footer.privacyPolicy'), path: '#' },
        { name: t('footer.termsOfService'), path: '#' },
    ];

    const socialLinks = [
        { icon: Twitter, label: 'Twitter', color: 'hover:text-sky-500' },
        { icon: Github, label: 'GitHub', color: 'hover:text-slate-800 dark:hover:text-white' },
        { icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-600' },
    ];

    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 pt-10 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top section: Logo + Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Logo + Tagline */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-3 group">
                            <div className="w-9 h-9 flex items-center justify-center overflow-hidden dark:hidden">
                                <img src={logoLight} alt="Nexora AI" className="w-full h-full object-contain transition-transform group-hover:scale-110 duration-300" />
                            </div>
                            <div className="hidden w-9 h-9 items-center justify-center overflow-hidden dark:flex">
                                <img src={logoDark} alt="Nexora AI" className="w-full h-full object-contain transition-transform group-hover:scale-110 duration-300" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                                Nexora <span className="text-primary italic">AI</span>
                            </span>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                            {t('footer.tagline')}
                        </p>
                    </div>

                    {/* Platform links */}
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3 uppercase text-xs tracking-widest">{t('footer.platform')}</h4>
                        <ul className="space-y-2">
                            {platformLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal links */}
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3 uppercase text-xs tracking-widest">{t('footer.legal')}</h4>
                        <ul className="space-y-2">
                            {legalLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-100 dark:border-slate-800">
                    <p className="text-slate-400 dark:text-slate-500 text-xs">
                        © {new Date().getFullYear()} Nexora AI. {t('footer.allRightsReserved')}
                    </p>
                    <div className="flex gap-4">
                        {socialLinks.map((social) => (
                            <motion.a
                                key={social.label}
                                href="#"
                                whileHover={{ scale: 1.2, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                className={`text-slate-400 dark:text-slate-500 ${social.color} transition-colors`}
                                aria-label={social.label}
                            >
                                <social.icon size={18} />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
