import React, { useState, useMemo, useRef } from 'react';
import { 
    Plus, 
    X, 
    Calculator, 
    Save, 
    Trash2, 
    AlertTriangle, 
    CheckCircle2, 
    Layers, 
    RotateCcw,
    Keyboard
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';
import { useNotification } from '../contexts/NotificationContext';
import { useSession } from '../contexts/SessionContext';
import { useKeyboard } from '../contexts/KeyboardContext';
import { calculateAverage, analyzeLotUniformity } from '../utils/calculations';
import VirtualKeyboard from '../components/VirtualKeyboard';

const AveragePage = () => {
    const { t } = useLanguage();
    const { addToHistory, autoSave, isHistoryFull } = useHistory();
    const { showNotification } = useNotification();
    const { isVirtualKeyboardEnabled, toggleVirtualKeyboard } = useKeyboard();
    const {
        averageValues: values,
        setAverageValues: setValues,
        averageResult: result,
        setAverageResult: setResult,
        clearAverageSession
    } = useSession();

    const [currentInput, setCurrentInput] = useState('');
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const inputRef = useRef(null);

    // Analyze uniformity in real time as samples are added
    const uniformity = useMemo(() => {
        return analyzeLotUniformity(values, 5.0);
    }, [values]);

    const handleKeyPress = (key) => {
        if (key === '.' && currentInput.includes('.')) return;
        setCurrentInput(prev => prev + key);
    };

    const handleDelete = () => {
        setCurrentInput(prev => prev.slice(0, -1));
    };

    const handleAdd = () => {
        if (!currentInput) return;
        const num = parseFloat(currentInput);
        if (!isNaN(num)) {
            setValues([...values, num]);
            setCurrentInput('');
            setIsKeyboardOpen(false);
            setResult(null);
            if (!isVirtualKeyboardEnabled && inputRef.current) {
                inputRef.current.focus();
            }
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

        showNotification('info', t('common.calculate') + '...', 1200);
        setTimeout(() => {
            showNotification('verified', `${t('average.average_is')} ${avg}%`);

            if (autoSave) {
                if (isHistoryFull) {
                    showNotification('error', t('settings.history_full'));
                } else {
                    addToHistory({
                        type: 'average',
                        input: values,
                        result: avg,
                        spread: uniformity.spread,
                        isUniform: uniformity.isUniform
                    });
                    showNotification('success', t('common.save') + '!');
                }
            }
        }, 400);
    };

    const handleSave = () => {
        if (result !== null) {
            addToHistory({
                type: 'average',
                input: values,
                result: result,
                spread: uniformity.spread,
                isUniform: uniformity.isUniform
            });
            showNotification('success', t('common.save') + '!');
        }
    };

    return (
        <div className="flex flex-col gap-5 animate-fade-in pb-20">
            <div className="glass-panel p-4 sm:p-7">
                {/* Header Title with no wrapping pill */}
                <div className="flex items-start justify-between gap-2 mb-4 sm:mb-5">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-xl sm:text-2xl font-bold gradient-text truncate">
                            {t('average.title')}
                        </h2>
                        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 truncate">
                            Análise de Média e Uniformidade
                        </p>
                    </div>
                    {values.length > 0 && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] whitespace-nowrap shrink-0 mt-0.5">
                            {values.length} {values.length === 1 ? 'amostra' : 'amostras'}
                        </span>
                    )}
                </div>

                {/* Main Input with Virtual & Native keyboard support */}
                <div className="mb-5">
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                        <label className="text-xs uppercase font-bold tracking-wider text-[var(--color-text-tertiary)] truncate">
                            {t('average.placeholder')}
                        </label>
                        <button
                            type="button"
                            onClick={toggleVirtualKeyboard}
                            className="text-[11px] font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1.5 py-0.5 px-2 rounded-lg bg-[var(--color-primary-light)]/60 transition-colors shrink-0"
                            title="Alternar entre teclado virtual e teclado nativo do aparelho"
                        >
                            <Keyboard size={13} />
                            <span>{isVirtualKeyboardEnabled ? 'Teclado Virtual' : 'Teclado Nativo'}</span>
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                ref={inputRef}
                                type="text"
                                inputMode="decimal"
                                value={currentInput}
                                onChange={(e) => {
                                    const val = e.target.value.replace(',', '.');
                                    if (/^[0-9]*\.?[0-9]*$/.test(val)) {
                                        setCurrentInput(val);
                                    }
                                }}
                                onFocus={() => {
                                    if (isVirtualKeyboardEnabled) {
                                        setIsKeyboardOpen(true);
                                    }
                                }}
                                onClick={() => {
                                    if (isVirtualKeyboardEnabled) {
                                        setIsKeyboardOpen(true);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAdd();
                                    }
                                }}
                                readOnly={isVirtualKeyboardEnabled}
                                placeholder="0.0%"
                                className="bg-[var(--color-surface-solid)] border-2 border-[var(--color-border)] rounded-2xl p-3.5 pr-10 w-full text-2xl sm:text-3xl font-mono font-bold text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-all cursor-pointer"
                            />
                            {currentInput && (
                                <button
                                    type="button"
                                    onClick={() => setCurrentInput('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--color-text-tertiary)] hover:text-red-500 rounded-full"
                                    title={t('common.clear')}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={!currentInput}
                            className="btn-primary aspect-square sm:aspect-auto sm:px-5 flex items-center justify-center shrink-0 disabled:opacity-40"
                            title={t('common.add')}
                        >
                            <Plus size={22} />
                            <span className="hidden sm:inline text-sm">{t('common.add')}</span>
                        </button>
                    </div>

                    {isVirtualKeyboardEnabled && isKeyboardOpen && (
                        <VirtualKeyboard
                            onKeyPress={handleKeyPress}
                            onDelete={handleDelete}
                            onSubmit={handleAdd}
                            onClose={() => setIsKeyboardOpen(false)}
                            submitIcon={Plus}
                            submitLabel={t('common.add')}
                        />
                    )}
                </div>

                {/* Samples Chips List */}
                {values.length > 0 ? (
                    <div className="mb-5">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                                {t('average.current_values')}
                            </h3>
                            <button
                                onClick={clearAverageSession}
                                className="text-xs text-red-500 hover:text-red-600 hover:underline flex items-center gap-1"
                            >
                                <RotateCcw size={12} />
                                {t('common.clear')}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                            {values.map((v, i) => (
                                <div 
                                    key={i} 
                                    className="bg-[var(--color-surface-solid)] border border-[var(--color-primary)]/30 text-[var(--color-text)] px-3 py-1 rounded-xl flex items-center gap-2 font-mono text-sm shadow-sm group hover:border-[var(--color-primary)] shrink-0"
                                >
                                    <span className="font-bold text-[var(--color-primary)]">#{i + 1}</span>
                                    <span>{v}%</span>
                                    <button 
                                        onClick={() => handleRemove(i)} 
                                        className="text-[var(--color-text-tertiary)] hover:text-red-500 hover:bg-red-500/10 p-0.5 rounded-full transition-colors ml-1"
                                        title={t('common.delete')}
                                    >
                                        <X size={13} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mb-5 p-3.5 rounded-xl bg-[var(--color-surface-solid)] border border-dashed border-[var(--color-border)] text-center text-xs text-[var(--color-text-secondary)] flex items-center justify-center gap-2">
                        <Layers size={16} className="text-[var(--color-text-tertiary)] shrink-0" />
                        <span className="truncate">{t('average.empty_hint')}</span>
                    </div>
                )}

                {/* Batch Uniformity Analysis Card (5.0% threshold) */}
                {uniformity.hasEnoughSamples && (
                    <div className="mb-5 animate-fade-in">
                        {uniformity.warning ? (
                            <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100 flex items-start gap-3 shadow-sm">
                                <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-sm">
                                    <AlertTriangle size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="font-bold text-sm text-amber-700 dark:text-amber-300 truncate">
                                            {t('uniformity.warning_title')}
                                        </h4>
                                        <span className="text-[11px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full shrink-0">
                                            Δ {uniformity.spread}%
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm mt-1 leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                                        {t('uniformity.warning_desc', {
                                            spread: uniformity.spread,
                                            max: uniformity.max,
                                            min: uniformity.min
                                        })}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 flex items-center gap-3">
                                <div className="p-1.5 rounded-xl bg-emerald-500 text-white shrink-0">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div className="flex-1 flex items-center justify-between gap-1 min-w-0">
                                    <div className="min-w-0">
                                        <span className="font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 block truncate">
                                            {t('uniformity.uniform_title')}
                                        </span>
                                        <p className="text-[11px] sm:text-xs text-emerald-800/80 dark:text-emerald-300/80 truncate">
                                            {t('uniformity.uniform_desc', {
                                                spread: uniformity.spread,
                                                threshold: uniformity.threshold
                                            })}
                                        </p>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 shrink-0 ml-2">
                                        Δ {uniformity.spread}%
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Quick Statistics Strip */}
                        <div className="grid grid-cols-3 gap-2 mt-2.5 text-center">
                            <div className="p-2 sm:p-2.5 rounded-xl bg-[var(--color-surface-solid)] border border-[var(--color-border)]">
                                <span className="block text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-tertiary)]">
                                    {t('uniformity.min_label')}
                                </span>
                                <span className="text-sm font-mono font-bold text-[var(--color-text)]">
                                    {uniformity.min}%
                                </span>
                            </div>
                            <div className="p-2 sm:p-2.5 rounded-xl bg-[var(--color-surface-solid)] border border-[var(--color-border)]">
                                <span className="block text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-tertiary)]">
                                    {t('uniformity.max_label')}
                                </span>
                                <span className="text-sm font-mono font-bold text-[var(--color-text)]">
                                    {uniformity.max}%
                                </span>
                            </div>
                            <div className="p-2 sm:p-2.5 rounded-xl bg-[var(--color-surface-solid)] border border-[var(--color-border)]">
                                <span className="block text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-tertiary)]">
                                    {t('uniformity.spread_label')}
                                </span>
                                <span className={`text-sm font-mono font-bold ${uniformity.warning ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {uniformity.spread}%
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Calculate Action Buttons */}
                <div className="flex gap-3 pt-1">
                    <button
                        onClick={handleCalculate}
                        disabled={values.length === 0}
                        className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed py-3"
                    >
                        <Calculator size={19} />
                        {t('common.calculate')}
                    </button>

                    <button
                        onClick={clearAverageSession}
                        disabled={values.length === 0}
                        className="btn-secondary aspect-square flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        title={t('common.clear')}
                    >
                        <Trash2 size={19} />
                    </button>
                </div>
            </div>

            {/* Calculated Average Result Card */}
            {result !== null && (
                <div className="glass-panel p-5 sm:p-7 border-2 border-[var(--color-primary)] animate-fade-in shadow-glow">
                    <div className="text-center">
                        <span className="text-xs uppercase font-bold tracking-wider text-[var(--color-text-secondary)]">
                            {t('average.average_is')}
                        </span>
                        
                        <div className="text-5xl sm:text-6xl font-black font-mono text-[var(--color-primary)] my-2 sm:my-3 tracking-tight">
                            {result}%
                        </div>

                        <p className="text-xs text-[var(--color-text-tertiary)] mb-4">
                            Calculado a partir de {values.length} amostras
                        </p>

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
