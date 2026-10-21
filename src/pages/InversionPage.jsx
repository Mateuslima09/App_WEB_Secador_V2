import React, { useState } from 'react';
import { 
    ArrowRightLeft, 
    Save, 
    AlertCircle, 
    CheckCircle2, 
    Trash2, 
    XCircle,
    Target,
    Keyboard
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';
import { useNotification } from '../contexts/NotificationContext';
import { useKeyboard } from '../contexts/KeyboardContext';
import { checkInversion } from '../utils/calculations';
import VirtualKeyboard from '../components/VirtualKeyboard';

const InversionPage = () => {
    const { t } = useLanguage();
    const { addToHistory, autoSave, isHistoryFull } = useHistory();
    const { showNotification } = useNotification();
    const { isVirtualKeyboardEnabled, toggleVirtualKeyboard } = useKeyboard();

    const [initial, setInitial] = useState('');
    const [perten, setPerten] = useState('');
    const [result, setResult] = useState(null);
    const [activeField, setActiveField] = useState('initial'); // 'initial' or 'perten'
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    const handleKeyPress = (key) => {
        if (activeField === 'initial') {
            if (key === '.' && initial.includes('.')) return;
            setInitial(prev => prev + key);
        } else {
            if (key === '.' && perten.includes('.')) return;
            setPerten(prev => prev + key);
        }
        setResult(null);
    };

    const handleDelete = () => {
        if (activeField === 'initial') {
            setInitial(prev => prev.slice(0, -1));
        } else {
            setPerten(prev => prev.slice(0, -1));
        }
        setResult(null);
    };

    const handleCheck = () => {
        if (!initial || !perten) {
            showNotification('error', 'Preencha a Umidade Inicial e a Umidade Perten');
            return;
        }

        const res = checkInversion(initial, perten);
        setResult(res);
        if (res.allowed) {
            showNotification('verified', t('inversion.allowed'));
        } else {
            showNotification('error', t('inversion.not_allowed'));
        }

        setIsKeyboardOpen(false);

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

    const handleClear = () => {
        setInitial('');
        setPerten('');
        setResult(null);
        setActiveField('initial');
    };

    return (
        <div className="flex flex-col gap-5 animate-fade-in pb-20">
            <div className="glass-panel p-4 sm:p-7">
                <div className="flex items-start justify-between gap-2 mb-4 sm:mb-5">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-xl sm:text-2xl font-bold gradient-text truncate">
                            {t('inversion.title')}
                        </h2>
                        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 truncate">
                            {t('inversion.subtitle')}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={toggleVirtualKeyboard}
                        className="text-[11px] font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-[var(--color-primary-light)]/60 transition-colors shrink-0"
                        title="Alternar entre teclado virtual e teclado nativo do celular"
                    >
                        <Keyboard size={13} />
                        <span>{isVirtualKeyboardEnabled ? 'Teclado Virtual' : 'Teclado Nativo'}</span>
                    </button>
                </div>

                <div className="flex flex-col gap-3.5">
                    {/* Input Field: Umidade Inicial */}
                    <div
                        onClick={() => {
                            setActiveField('initial');
                            if (isVirtualKeyboardEnabled) setIsKeyboardOpen(true);
                        }}
                        className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all ${
                            activeField === 'initial'
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]/40 shadow-sm'
                                : 'border-[var(--color-border)] bg-[var(--color-surface-solid)] hover:border-[var(--color-primary)]/50'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs uppercase font-bold tracking-wider ${
                                activeField === 'initial' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'
                            }`}>
                                {t('inversion.initial_moisture')}
                            </span>
                            {activeField === 'initial' && (
                                <span className="text-[10px] font-semibold text-[var(--color-primary)] bg-[var(--color-surface-solid)] px-2 py-0.5 rounded-full">
                                    Editando
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={initial}
                            onChange={(e) => {
                                const val = e.target.value.replace(',', '.');
                                if (/^[0-9]*\.?[0-9]*$/.test(val)) {
                                    setInitial(val);
                                    setResult(null);
                                }
                            }}
                            onFocus={() => {
                                setActiveField('initial');
                                if (isVirtualKeyboardEnabled) setIsKeyboardOpen(true);
                            }}
                            readOnly={isVirtualKeyboardEnabled}
                            placeholder="Toque para inserir"
                            className="bg-transparent w-full text-2xl sm:text-3xl font-mono font-bold text-[var(--color-text)] focus:outline-none cursor-pointer"
                        />
                    </div>

                    {/* Input Field: Umidade Perten */}
                    <div
                        onClick={() => {
                            setActiveField('perten');
                            if (isVirtualKeyboardEnabled) setIsKeyboardOpen(true);
                        }}
                        className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all ${
                            activeField === 'perten'
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]/40 shadow-sm'
                                : 'border-[var(--color-border)] bg-[var(--color-surface-solid)] hover:border-[var(--color-primary)]/50'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs uppercase font-bold tracking-wider ${
                                activeField === 'perten' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'
                            }`}>
                                {t('inversion.perten_moisture')}
                            </span>
                            {activeField === 'perten' && (
                                <span className="text-[10px] font-semibold text-[var(--color-primary)] bg-[var(--color-surface-solid)] px-2 py-0.5 rounded-full">
                                    Editando
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={perten}
                            onChange={(e) => {
                                const val = e.target.value.replace(',', '.');
                                if (/^[0-9]*\.?[0-9]*$/.test(val)) {
                                    setPerten(val);
                                    setResult(null);
                                }
                            }}
                            onFocus={() => {
                                setActiveField('perten');
                                if (isVirtualKeyboardEnabled) setIsKeyboardOpen(true);
                            }}
                            readOnly={isVirtualKeyboardEnabled}
                            placeholder="Toque para inserir"
                            className="bg-transparent w-full text-2xl sm:text-3xl font-mono font-bold text-[var(--color-text)] focus:outline-none cursor-pointer"
                        />
                    </div>

                    {/* Action Buttons: Verificar & Limpar */}
                    <div className="flex gap-3 pt-1">
                        <button
                            onClick={handleCheck}
                            disabled={!initial || !perten}
                            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed py-3"
                            type="button"
                        >
                            <ArrowRightLeft size={19} />
                            {t('inversion.check')}
                        </button>

                        <button
                            onClick={handleClear}
                            disabled={!initial && !perten && !result}
                            className="btn-secondary aspect-square flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            type="button"
                            title={t('common.clear')}
                        >
                            <Trash2 size={19} />
                        </button>
                    </div>

                    {isVirtualKeyboardEnabled && isKeyboardOpen && (
                        <VirtualKeyboard
                            onKeyPress={handleKeyPress}
                            onDelete={handleDelete}
                            onSubmit={handleCheck}
                            onClose={() => setIsKeyboardOpen(false)}
                            submitIcon={ArrowRightLeft}
                            submitLabel={t('inversion.check')}
                        />
                    )}
                </div>
            </div>

            {/* Inversion Result Card */}
            {result && (
                <div 
                    className={`glass-panel p-5 sm:p-7 border-2 animate-fade-in ${
                        result.allowed 
                            ? 'border-emerald-500 shadow-glow' 
                            : 'border-red-500/80 shadow-lg'
                    }`}
                >
                    <div className="flex items-center gap-3.5 mb-4">
                        <div className={`p-2.5 sm:p-3 rounded-2xl ${
                            result.allowed ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                        } shrink-0 shadow-sm`}>
                            {result.allowed ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className={`text-lg sm:text-2xl font-black tracking-tight truncate ${
                                result.allowed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                                {result.allowed ? t('inversion.allowed') : t('inversion.not_allowed')}
                            </h3>
                            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 truncate">
                                {t(`inversion.reasons.${result.reason}`)}
                            </p>
                        </div>
                    </div>

                    {/* Target & Limit Parameters Grid */}
                    <div className="grid grid-cols-2 gap-3 my-4 p-3.5 sm:p-4 bg-[var(--color-surface-solid)] rounded-2xl border border-[var(--color-border)]">
                        <div>
                            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] flex items-center gap-1 mb-1">
                                <Target size={12} />
                                {t('inversion.target')}
                            </div>
                            <div className="font-mono font-extrabold text-lg sm:text-xl text-[var(--color-text)]">
                                {result.target.toFixed(2)}%
                            </div>
                            <span className="text-[10px] text-[var(--color-text-tertiary)]">
                                (Ini + 12.5) / 2
                            </span>
                        </div>
                        <div>
                            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] flex items-center gap-1 mb-1">
                                <AlertCircle size={12} />
                                {t('inversion.limit')}
                            </div>
                            <div className="font-mono font-extrabold text-lg sm:text-xl text-[var(--color-text)]">
                                {result.limit.toFixed(2)}%
                            </div>
                            <span className="text-[10px] text-[var(--color-text-tertiary)]">
                                Alvo + 2.5%
                            </span>
                        </div>
                    </div>

                    {!autoSave && (
                        <button
                            onClick={handleSave}
                            disabled={isHistoryFull}
                            className={`btn-secondary w-full justify-center flex items-center gap-2 mt-2 ${
                                isHistoryFull ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
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
