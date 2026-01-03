import React, { useState } from 'react';
import { Trash2, Calculator, ArrowRightLeft } from 'lucide-react';
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
    let progressColor = 'bg-green-500';
    if (percentage > 80) progressColor = 'bg-red-500';
    else if (percentage > 50) progressColor = 'bg-yellow-500';

    return (
        <div className="animate-fade-in p-4 pb-24">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold gradient-text">{t('menu.history')}</h1>
                    <p className="text-[var(--color-text-secondary)]">{t('settings.history_description') || 'Gerencie seu histórico de cálculos.'}</p>
                </div>
                {history.length > 0 && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                        title={t('common.clear')}
                    >
                        <Trash2 size={20} />
                    </button>
                )}
            </div>

            {/* Storage Progress Bar */}
            <div className="mb-6 bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shadow-sm">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                        {t('settings.history_storage') || 'Armazenamento'}
                    </span>
                    <span className={`text-sm font-bold ${percentage >= 100 ? 'text-red-500' : 'text-[var(--color-text)]'}`}>
                        {history.length} / {MAX_ITEMS}
                    </span>
                </div>
                <div className="w-full bg-[var(--color-bg)] rounded-full h-2.5 overflow-hidden border border-[var(--color-border)]">
                    <div
                        className={`h-2.5 rounded-full transition-all duration-500 ease-out ${progressColor}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>

            <div className="space-y-4">
                {history.length === 0 ? (
                    <div className="text-center py-12 text-[var(--color-text-secondary)] opacity-50">
                        <HistoryIcon size={48} className="mx-auto mb-2" />
                        <p>{t('settings.no_history_yet') || 'Nenhum histórico ainda'}</p>
                    </div>
                ) : (
                    history.map((item) => (
                        <div key={item.id} className="glass-panel p-4 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold uppercase text-xs tracking-wider">
                                    {item.type === 'average' ? <Calculator size={14} /> : <ArrowRightLeft size={14} />}
                                    {t(`menu.${item.type}`)}
                                </div>
                                <div className="text-xs text-[var(--color-text-secondary)]">
                                    {new Date(item.date).toLocaleString()}
                                </div>
                            </div>

                            {item.type === 'average' && (
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-sm text-[var(--color-text-secondary)]">
                                        {item.input.join(', ')}
                                    </div>
                                    <div className="text-xl font-bold">
                                        {item.result} %
                                    </div>
                                </div>
                            )}

                            {item.type === 'inversion' && (
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-sm text-[var(--color-text-secondary)]">
                                        Ini: {item.initial}% | Per: {item.perten}%
                                    </div>
                                    <div className={`text-lg font-bold ${item.result.allowed ? 'text-green-500' : 'text-red-500'}`}>
                                        {item.result.allowed ? 'YES' : 'NO'}
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
        </div >
    );
};

const HistoryIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /><path d="M12 7v5l4 2" /></svg>
);

export default HistoryPage;
