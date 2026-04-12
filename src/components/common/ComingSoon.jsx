import { Construction } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ComingSoon = ({ title }) => {
    const { t } = useTranslation();
    const displayTitle = title || t('common.comingSoon');

    return (
        <div className="flex flex-col items-center justify-center h-96 text-center p-8 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 border-dashed">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-4 text-slate-400 dark:text-slate-500">
                <Construction className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{displayTitle}</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
                {t('common.comingSoonDesc')}
            </p>
        </div>
    );
};

export default ComingSoon;
