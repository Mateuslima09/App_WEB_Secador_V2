import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowRightLeft, 
    Calculator, 
    History, 
    Settings, 
    ChevronRight, 
    Sparkles, 
    Clock, 
    TrendingUp,
    ShieldCheck,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';

const HomePage = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { history } = useHistory();

    // Determine time-based greeting
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return t('home.greeting_morning');
        if (hour < 18) return t('home.greeting_afternoon');
        return t('home.greeting_evening');
    }, [t]);

    const latestItem = history.length > 0 ? history[0] : null;

    const actionCards = [
        {
            path: '/inversion',
            title: t('home.inversion_title'),
            desc: t('home.inversion_desc'),
            badge: t('home.inversion_badge'),
            icon: ArrowRightLeft,
            iconColor: 'text-emerald-500',
            bgGlow: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
            iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            tagBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
        },
        {
            path: '/average',
            title: t('home.average_title'),
            desc: t('home.average_desc'),
            badge: t('home.average_badge'),
            icon: Calculator,
            iconColor: 'text-blue-500',
            bgGlow: 'hover:border-blue-500/50 hover:shadow-blue-500/10',
            iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
            tagBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
            isNew: true
        },
        {
            path: '/history',
            title: t('home.history_title'),
            desc: t('home.history_desc'),
            badge: `${history.length} / 100`,
            icon: History,
            iconColor: 'text-purple-500',
            bgGlow: 'hover:border-purple-500/50 hover:shadow-purple-500/10',
            iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
            tagBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
        },
        {
            path: '/settings',
            title: t('home.settings_title'),
            desc: t('home.settings_desc'),
            badge: null,
            icon: Settings,
            iconColor: 'text-slate-500',
            bgGlow: 'hover:border-slate-500/50 hover:shadow-slate-500/10',
            iconBg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
            tagBg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
        }
    ];

    return (
        <div className="flex flex-col gap-6 animate-fade-in pb-12">
            {/* Hero Welcome Banner */}
            <div className="glass-panel p-6 sm:p-8 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3 border border-emerald-500/20">
                            <Sparkles size={13} />
                            <span>{t('home.version_badge')} • Clean</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
                            {greeting}, <span className="gradient-text">{t('home.app_name')}</span>
                        </h1>
                        <p className="text-[var(--color-text-secondary)] mt-1.5 text-sm sm:text-base max-w-xl">
                            {t('home.tagline')}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)] bg-[var(--color-bg)]/60 px-3.5 py-2 rounded-xl border border-[var(--color-border)] self-start md:self-auto">
                        <Clock size={15} />
                        <span>{new Date().toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' })}</span>
                    </div>
                </div>

                {/* Decorative subtle background gradient */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Section Prompt */}
            <div>
                <h2 className="text-sm uppercase font-bold tracking-wider text-[var(--color-text-tertiary)] mb-3 px-1">
                    {t('home.choose_action')}
                </h2>

                {/* Action Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {actionCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <button
                                key={card.path}
                                onClick={() => navigate(card.path)}
                                className={`glass-panel p-5 text-left flex flex-col justify-between group transition-all duration-200 hover:-translate-y-1 ${card.bgGlow}`}
                            >
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div className={`p-3 rounded-2xl ${card.iconBg} transition-transform group-hover:scale-110 duration-200`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {card.badge && (
                                            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${card.tagBg}`}>
                                                {card.badge}
                                            </span>
                                        )}
                                        <div className="p-1 rounded-full text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary)] transition-colors">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                                        {card.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                                        {card.desc}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Recent Activity Card */}
            <div className="glass-panel p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-[var(--color-primary)]" />
                        <h3 className="font-bold text-sm sm:text-base text-[var(--color-text)]">
                            {t('home.recent_title')}
                        </h3>
                    </div>
                    {latestItem && (
                        <button
                            onClick={() => navigate('/history')}
                            className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                        >
                            {t('home.view_history')}
                            <ChevronRight size={14} />
                        </button>
                    )}
                </div>

                {latestItem ? (
                    <div 
                        onClick={() => navigate('/history')}
                        className="p-4 rounded-xl bg-[var(--color-surface-solid)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                                {latestItem.type === 'inversion' ? <ArrowRightLeft size={20} /> : <Calculator size={20} />}
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold tracking-wider text-[var(--color-text-tertiary)]">
                                    {latestItem.type === 'inversion' ? t('menu.inversion') : t('menu.average')}
                                </span>
                                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                                    {new Date(latestItem.date).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {latestItem.type === 'inversion' && (
                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <div className="text-xs text-[var(--color-text-tertiary)]">Ini: {latestItem.initial}% | Per: {latestItem.perten}%</div>
                                        <div className="text-xs font-semibold">Alvo: {latestItem.result?.target?.toFixed(1)}%</div>
                                    </div>
                                    {latestItem.result?.allowed ? (
                                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold text-sm bg-green-500/10 px-2.5 py-1 rounded-lg">
                                            <CheckCircle2 size={16} />
                                            <span>LIBERADO</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold text-sm bg-red-500/10 px-2.5 py-1 rounded-lg">
                                            <XCircle size={16} />
                                            <span>NÃO LIBERADO</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {latestItem.type === 'average' && (
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <span className="text-xs text-[var(--color-text-tertiary)]">
                                            {latestItem.input?.length} amostras
                                        </span>
                                    </div>
                                    <div className="text-lg font-mono font-extrabold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1 rounded-lg">
                                        {latestItem.result}%
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 text-[var(--color-text-secondary)] text-sm">
                        <p>{t('home.no_recent')}</p>
                        <div className="flex justify-center gap-2 mt-3">
                            <button
                                onClick={() => navigate('/inversion')}
                                className="btn-secondary text-xs py-1.5 px-3"
                            >
                                {t('home.inversion_title')}
                            </button>
                            <button
                                onClick={() => navigate('/average')}
                                className="btn-primary text-xs py-1.5 px-3"
                            >
                                {t('home.average_title')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
