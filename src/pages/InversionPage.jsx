import React, { useState } from 'react';
import { ArrowRightLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';
import { useNotification } from '../contexts/NotificationContext';
import { checkInversion } from '../utils/calculations';

const InversionPage = () => {
    const { t } = useLanguage();
    const { addToHistory, autoSave, isHistoryFull } = useHistory();
    const { showNotification } = useNotification();

    const [initial, setInitial] = useState('');
    const [perten, setPerten] = useState('');
    const [result, setResult] = useState(null);

    const handleCheck = (e) => {
        e.preventDefault();
        if (!initial || !perten) return;

        const res = checkInversion(initial, perten);
        setResult(res);
        if (res.allowed) {
            showNotification('verified', t('inversion.allowed'));
        } else {
            showNotification('error', t('inversion.not_allowed'));
        }

        if (autoSave) {
            if (isHistoryFull) {
                showNotification('error', t('settings.history_full'));
            } else {
                addToHistory({
                    type: 'inversion',
                    initial: initial,
                    perten: perten,
                    result: res
                });
                showNotification('success', t('common.save') + '!');
            }
        }
    };

    const handleSave = () => {
        if (result) {
            addToHistory({
                type: 'inversion',
                initial: initial,
                perten: perten,
                result: result
            });
            showNotification('success', t('common.save') + '!');
        }
    };


    return (
        <div className="flex flex-col gap-6">
            <div className="glass-panel p-6">
                <h2 className="text-2xl font-bold mb-6 gradient-text">{t('inversion.title')}</h2>

                <form onSubmit={handleCheck} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-[var(--color-text-secondary)]">
                            {t('inversion.initial_moisture')}
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={initial}
                            onChange={(e) => setInitial(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-[var(--color-text-secondary)]">
                            {t('inversion.perten_moisture')}
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={perten}
                            onChange={(e) => setPerten(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary mt-4">
                        <ArrowRightLeft size={20} />
                        {t('inversion.check')}
                    </button>
                </form>
            </div>

            {result && (
                <div className={`glass-panel p-6 border-l-8 ${result.allowed ? 'border-l-green-500' : 'border-l-red-500'}`}>
                    <div className="flex items-center gap-4 mb-4">
                        {result.allowed ? (
                            <CheckCircle size={48} className="text-green-500" />
                        ) : (
                            <AlertCircle size={48} className="text-red-500" />
                        )}
                        <div>
                            <h3 className={`text-xl font-bold ${result.allowed ? 'text-green-500' : 'text-red-500'}`}>
                                {result.allowed ? t('inversion.allowed') : t('inversion.not_allowed')}
                            </h3>
                            <p className="text-[var(--color-text-secondary)]">
                                {t(`inversion.reasons.${result.reason}`)}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 my-4 p-4 bg-[var(--color-bg)] rounded-lg">
                        <div>
                            <div className="text-xs text-[var(--color-text-secondary)] uppercase">{t('inversion.target')}</div>
                            <div className="font-mono font-bold text-lg">{result.target.toFixed(2)}%</div>
                        </div>
                        <div>
                            <div className="text-xs text-[var(--color-text-secondary)] uppercase">{t('inversion.limit')}</div>
                            <div className="font-mono font-bold text-lg">{result.limit.toFixed(2)}%</div>
                        </div>
                    </div>

                    {!autoSave && (
                        <button
                            onClick={handleSave}
                            disabled={isHistoryFull}
                            className={`btn-secondary w-full justify-center flex items-center gap-2 mt-2 ${isHistoryFull ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={isHistoryFull ? t('settings.history_full') : ''}
                        >
                            <Save size={18} />
                            {isHistoryFull ? t('settings.history_full') : `${t('common.save')} ${t('menu.history')}`}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default InversionPage;
