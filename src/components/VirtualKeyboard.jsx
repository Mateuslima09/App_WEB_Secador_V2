import React from 'react';
import { Delete, X, GripHorizontal } from 'lucide-react';
import Draggable from './Draggable';

const VirtualKeyboard = ({ onKeyPress, onDelete, onSubmit, onClose, submitLabel, submitIcon: SubmitIcon }) => {
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0];

    return (
        <Draggable handleId="keyboard-handle" persistenceKey="virtual-keyboard-pos">
            <div className="bg-[var(--color-bg)] rounded-2xl shadow-2xl border border-[var(--color-border)] p-4 w-80 animate-slide-up backdrop-blur-md bg-opacity-95">
                {/* Drag Handle & Header */}
                <div
                    id="keyboard-handle"
                    className="flex items-center justify-between mb-2 cursor-grab active:cursor-grabbing p-1 -mt-2 -mx-2 border-b border-[var(--color-border)]/30 pb-2"
                >
                    <div className="text-[var(--color-text-tertiary)] flex items-center gap-2 pl-2">
                        <GripHorizontal size={20} />
                        <span className="text-xs uppercase font-bold tracking-widest opacity-70">Teclado</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-500/10 p-1 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {keys.map((key) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onKeyPress(key.toString())}
                            className="h-12 text-xl font-bold rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors border border-[var(--color-border)] shadow-sm active:scale-95 flex items-center justify-center"
                        >
                            {key}
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={onDelete}
                        className="h-12 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-200 active:scale-95"
                    >
                        <Delete size={20} />
                    </button>

                    <button
                        type="button"
                        onClick={onSubmit}
                        className="col-span-3 h-12 flex items-center justify-center gap-2 text-lg font-bold rounded-xl btn-primary shadow-md active:scale-95 sm:col-span-1"
                    >
                        {SubmitIcon && <SubmitIcon size={20} />}
                        {submitLabel && <span className="text-sm">{submitLabel}</span>}
                    </button>
                </div>
            </div>
        </Draggable>
    );
};

export default VirtualKeyboard;
