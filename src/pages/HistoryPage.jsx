import React, { useState } from 'react';
import { Trash2, Calculator, ArrowRightLeft, AlertTriangle, CheckCircle2, History as HistoryIcon, Clock } from 'lucide-react';
import { useHistory } from '../contexts/HistoryContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import ConfirmModal from '../components/ConfirmModal';

const HistoryPage = () => {
    const { history, clearHistory, MAX_ITEMS } = useHistory();
    const { t } = useLanguage();
    const { showNotification } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirmClear = () => {
        clearHistory();
        setIsModalOpen(false);
        showNotification('success', t('settings.history_cleared') || 'Histórico apagado!');
    };

    // Calculate progress
    const percentage = Math.min((history.length / MAX_ITEMS) * 100, 100);

    // Determine color based on percentage
    let progressColor = 'bg-emerald-500';
    if (percentage > 80) progressColor = 'bg-red-500';
    else if (percentage > 50) progressColor = 'bg-amber-500';

    return (
        <div className="animate-fade-in pb-20">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h1 className="text-2xl font-bold gradient-text">{t('menu.history')}</h1>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                        {t('settings.history_description') || 'Gerencie seu histórico de cálculos.'}
                    </p>
                </div>
                {history.length > 0 && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                        title={t('common.clear')}
                    >
                        <Trash2 size={20} />
                    </button>
                )}
            </div>

            {/* Storage Progress Bar */}
            <div className="mb-6 glass-panel p-4">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-[var(--color-text-secondary)]">
                        {t('settings.history_storage') || 'Armazenamento'}
                    </span>
                    <span className={`text-xs font-mono font-bold ${percentage >= 100 ? 'text-red-500' : 'text-[var(--color-text)]'}`}>
                        {history.length} / {MAX_ITEMS}
                    </span>
                </div>
                <div className="w-full bg-[var(--color-bg)] rounded-full h-2.5 overflow-hidden border border-[var(--color-border)]">
                    <div
                        className={`h-2.5 rounded-full transition-all duration-500 ease-out ${progressColor}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {/* History Items List */}
            <div className="space-y-3">
                {history.length === 0 ? (
                    <div className="glass-panel text-center py-12 text-[var(--color-text-secondary)]">
                        <HistoryIcon size={44} className="mx-auto mb-3 opacity-30 text-[var(--color-primary)]" />
                        <p className="text-sm font-medium">{t('settings.no_history_yet') || 'Nenhum histórico ainda'}</p>
                    </div>
                ) : (
                    history.map((item) => (
                        <div key={item.id} className="glass-panel p-4 flex flex-col gap-2.5 hover:border-[var(--color-primary)]/40 transition-colors">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold uppercase text-xs tracking-wider">
                                    <div className="p-1.5 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                                        {item.type === 'average' ? <Calculator size={14} /> : <ArrowRightLeft size={14} />}
                                    </div>
                                    <span>{t(`menu.${item.type}`)}</span>
                                </div>
                                <div className="text-xs text-[var(--color-text-tertiary)] flex items-center gap-1 font-mono">
                                    <Clock size={12} />
                                    {new Date(item.date).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                                </div>
                            </div>

                            {item.type === 'average' && (
                                <div className="flex justify-between items-center gap-2 mt-1">
                                    <div className="min-w-0 flex-1">
                                        <div className="text-xs text-[var(--color-text-secondary)] font-mono truncate">
                                            {item.input?.join('%, ')}%
                                        </div>
                                        {item.spread !== undefined && (
                                            <div className="flex items-center gap-1.5 mt-1">
                                                {item.isUniform === false ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md whitespace-nowrap shrink-0">
                                                        <AlertTriangle size={11} />
                                                        Desuniforme (Δ {item.spread}%)
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md whitespace-nowrap shrink-0">
                                                        <CheckCircle2 size={11} />
                                                        Uniforme (Δ {item.spread}%)
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xl sm:text-2xl font-mono font-black text-[var(--color-primary)] shrink-0 whitespace-nowrap">
                                        {item.result}%
                                    </div>
                                </div>
                            )}

                            {item.type === 'inversion' && (
                                <div className="flex justify-between items-center gap-2 mt-1">
                                    <div className="text-xs text-[var(--color-text-secondary)] font-mono min-w-0 flex-1">
                                        <div className="truncate">
                                            Ini: {item.initial}% | Per: {item.perten}%
                                        </div>
                                        {item.result?.target && (
                                            <span className="block text-[11px] text-[var(--color-text-tertiary)] mt-0.5 truncate">
                                                Alvo: {item.result.target.toFixed(1)}% | Limite: {item.result.limit.toFixed(1)}%
                                            </span>
                                        )}
                                    </div>
                                    <div className={`text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg shrink-0 whitespace-nowrap ${
                                        item.result?.allowed 
                                            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
                                            : 'text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20'
                                    }`}>
                                        {item.result?.allowed ? 'LIBERADO' : 'NÃO LIBERADO'}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmClear}
                title={t('menu.history')}
                message={t('common.confirm_clear_history') || "Tem certeza que deseja apagar todo o histórico?"}
            />
        </div>
    );
};

export default HistoryPage;
