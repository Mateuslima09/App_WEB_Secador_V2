import React, { useState } from 'react';
import { ArrowRightLeft, Save, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';
import { useNotification } from '../contexts/NotificationContext';
import { checkInversion } from '../utils/calculations';
import VirtualKeyboard from '../components/VirtualKeyboard';

const InversionPage = () => {
    const { t } = useLanguage();
    const { addToHistory, autoSave, isHistoryFull } = useHistory();
    const { showNotification } = useNotification();

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
        if (!initial || !perten) return;

        const res = checkInversion(initial, perten);
        setResult(res);
        if (res.allowed) {
            showNotification('verified', t('inversion.allowed'));
        } else {
            showNotification('error', t('inversion.not_allowed'));
        }

        setIsKeyboardOpen(false); // Close keyboard on check

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

                <div className="flex flex-col gap-4">
                    <div
                        onClick={() => {
                            setActiveField('initial');
                            setIsKeyboardOpen(true);
                        }}
                        className={`cursor-pointer transition-all ${activeField === 'initial' ? 'transform scale-[1.02]' : 'opacity-70 hook-hover'}`}
                    >
                        <label className={`block text-sm font-medium mb-1 transition-colors ${activeField === 'initial' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                            {t('inversion.initial_moisture')}
                        </label>
                        <div className={`input-field flex items-center h-12 ${activeField === 'initial' ? 'ring-2 ring-[var(--color-primary)] bg-[var(--color-primary)]/5' : ''}`}>
                            <span className="text-lg font-mono">{initial}</span>
                        </div>
                    </div>

                    <div
                        onClick={() => {
                            setActiveField('perten');
                            setIsKeyboardOpen(true);
                        }}
                        className={`cursor-pointer transition-all ${activeField === 'perten' ? 'transform scale-[1.02]' : 'opacity-70 hook-hover'}`}
                    >
                        <label className={`block text-sm font-medium mb-1 transition-colors ${activeField === 'perten' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                            {t('inversion.perten_moisture')}
                        </label>
                        <div className={`input-field flex items-center h-12 ${activeField === 'perten' ? 'ring-2 ring-[var(--color-primary)] bg-[var(--color-primary)]/5' : ''}`}>
                            <span className="text-lg font-mono">{perten}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setInitial('');
                            setPerten('');
                            setResult(null);
                        }}
                        className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
                        type="button"
                    >
                        <Trash2 size={18} />
                        {t('common.clear')}
                    </button>

                    {isKeyboardOpen && (
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
