import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';

const Footer = () => {
    const { t } = useTranslation();

    const footerLinks = {
        platform: [
            { name: t('nav.courses'), path: '/courses' },
            { name: t('nav.instructors'), path: '/instructors' },
            { name: t('nav.aiDemo'), path: '/ai-demo' },
        ],
        company: [
            { name: t('footer.company'), path: '/about' },
            { name: t('footer.careers'), path: '#' },
            { name: t('footer.blog'), path: '#' },
        ],
        legal: [
            { name: t('footer.privacyPolicy'), path: '#' },
            { name: t('footer.termsOfService'), path: '#' },
            { name: t('footer.cookiePolicy'), path: '#' },
        ]
    };

    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            {/* Light mode logo */}
                            <div className="w-10 h-10 flex items-center justify-center overflow-hidden dark:hidden group">
                                <img src={logoLight} alt="Nexora AI Logo" className="w-full h-full object-contain transition-transform group-hover:scale-110" />
                            </div>
                            {/* Dark mode logo */}
                            <div className="hidden w-10 h-10 items-center justify-center overflow-hidden dark:flex group">
                                <img src={logoDark} alt="Nexora AI Logo" className="w-full h-full object-contain transition-transform group-hover:scale-110" />
                            </div>
                            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                                Nexora <span className="text-primary italic">AI</span>
                            </span>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            {t('footer.tagline')}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">{t('footer.platform')}</h4>
                        <ul className="space-y-4">
                            {footerLinks.platform.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">{t('footer.company')}</h4>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">{t('footer.legal')}</h4>
                        <ul className="space-y-4">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-gray-100 dark:border-slate-800">
                    <p className="text-slate-500 text-xs">
                        © {new Date().getFullYear()} Nexora AI. {t('footer.allRightsReserved')}
                    </p>
                    <div className="flex gap-4 text-slate-400 dark:text-slate-500">
                        <a href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="hover:text-primary transition-colors"><Github size={20} /></a>
                        <a href="#" className="hover:text-primary transition-colors"><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
