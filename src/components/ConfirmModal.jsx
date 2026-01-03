import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    const { t } = useLanguage();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="glass-panel w-full max-w-md p-6 relative animate-bounce-in border-red-500/50">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-2">
                        <AlertTriangle size={32} />
                    </div>

                    <h3 className="text-xl font-bold text-white">
                        {title || t('common.are_you_sure')}
                    </h3>

                    <p className="text-[var(--color-text-secondary)] mb-4">
                        {message}
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="btn-secondary flex-1 justify-center"
                        >
                            {t('common.cancel') || 'Cancelar'}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="btn-primary bg-red-600 hover:bg-red-700 border-red-500 text-white flex-1 justify-center"
                        >
                            {t('common.confirm') || 'Confirmar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
