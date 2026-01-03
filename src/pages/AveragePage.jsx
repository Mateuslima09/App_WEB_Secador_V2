import React, { useState } from 'react';
import { Plus, X, Calculator, Save } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';
import { useNotification } from '../contexts/NotificationContext';
import { calculateAverage } from '../utils/calculations';

const AveragePage = () => {
    const { t } = useLanguage();
    const { addToHistory, autoSave, isHistoryFull } = useHistory();
    const { showNotification } = useNotification();

    const [currentInput, setCurrentInput] = useState('');
    const [values, setValues] = useState([]);
    const [result, setResult] = useState(null);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!currentInput) return;
        const num = parseFloat(currentInput);
        if (!isNaN(num)) {
            setValues([...values, num]);
            setCurrentInput('');
            setResult(null); // Reset result when values change
        }
    };

    const handleRemove = (index) => {
        const newValues = values.filter((_, i) => i !== index);
        setValues(newValues);
        setResult(null);
    };

    const handleCalculate = () => {
        if (values.length === 0) return;
        const avg = calculateAverage(values);
        setResult(avg);
        showNotification('info', t('common.calculate') + '...', 1500);
        setTimeout(() => {
            showNotification('verified', `${t('average.average_is')}: ${avg}`);

            if (autoSave) {
                if (isHistoryFull) {
                    showNotification('error', t('settings.history_full'));
                } else {
                    addToHistory({
                        type: 'average',
                        input: values,
                        result: avg
                    });
                    showNotification('success', t('common.save') + '!');
                }
            }
        }, 500);
    };

    const handleSave = () => {
        if (result !== null) {
            addToHistory({
                type: 'average',
                input: values,
                result: result
            });
            showNotification('success', t('common.save') + '!');
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="glass-panel p-6">
                <h2 className="text-2xl font-bold mb-4 gradient-text">{t('average.title')}</h2>

                <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                    <input
                        type="number"
                        step="0.01"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder={t('average.placeholder')}
                        className="input-field flex-1"
                    />
                    <button type="submit" className="btn-primary">
                        <Plus size={20} />
                    </button>
                </form>

                {values.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">
                            {t('average.current_values')}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {values.map((v, i) => (
                                <div key={i} className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)] text-[var(--color-primary)] px-3 py-1 rounded-full flex items-center gap-2 font-mono">
                                    {v}
                                    <button onClick={() => handleRemove(i)} className="hover:text-red-500">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-4">
                    <button
                        onClick={handleCalculate}
                        disabled={values.length === 0}
                        className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Calculator size={20} />
                        {t('common.calculate')}
                    </button>
                </div>
            </div>

            {result !== null && (
                <div className="glass-panel p-6 border-[var(--color-primary)] border-2 animate-bounce-in">
                    <div className="text-center">
                        <span className="text-[var(--color-text-secondary)]">{t('average.average_is')}</span>
                        <div className="text-6xl font-bold text-[var(--color-primary)] my-4">
                            {result}
                        </div>
                        {!autoSave && (
                            <button
                                onClick={handleSave}
                                disabled={isHistoryFull}
                                className={`btn-secondary w-full justify-center flex items-center gap-2 ${isHistoryFull ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={isHistoryFull ? t('settings.history_full') : ''}
                            >
                                <Save size={18} />
                                {isHistoryFull ? t('settings.history_full') : `${t('common.save')} ${t('menu.history')}`}
                            </button>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default AveragePage;
