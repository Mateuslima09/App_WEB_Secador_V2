import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { CheckCircle, AlertCircle, Info, X, ShieldCheck } from 'lucide-react';

const NotificationContainer = () => {
    const { notifications, removeNotification } = useNotification();

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={24} className="text-green-400" />;
            case 'error': return <AlertCircle size={24} className="text-red-400" />;
            case 'verified': return <ShieldCheck size={24} className="text-blue-400" />;
            default: return <Info size={24} className="text-[var(--color-primary)]" />;
        }
    };

    const getStyles = (type) => {
        // Base glassmorphism + specific border colors
        const base = "backdrop-blur-md bg-black/60 border-l-4 shadow-lg rounded-r-lg p-4 mb-3 flex items-start gap-3 w-80 transform transition-all duration-300 ease-in-out animate-slide-in-right";
        switch (type) {
            case 'success': return `${base} border-green-500 shadow-green-500/20`;
            case 'error': return `${base} border-red-500 shadow-red-500/20`;
            case 'verified': return `${base} border-blue-500 shadow-blue-500/20`;
            default: return `${base} border-[var(--color-primary)] shadow-[var(--color-primary)]/20`;
        }
    };

    return (
        <div className="fixed top-20 right-4 z-50 flex flex-col items-end pointer-events-none">
            {notifications.map((note) => (
                <div
                    key={note.id}
                    className={`${getStyles(note.type)} pointer-events-auto`}
                >
                    <div className="shrink-0 pt-0.5">
                        {getIcon(note.type)}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-white text-sm capitalize mb-0.5">
                            {note.type === 'verified' ? 'Verificado' : note.type}
                        </h4>
                        <p className="text-gray-200 text-sm leading-tight">
                            {note.message}
                        </p>
                    </div>
                    <button
                        onClick={() => removeNotification(note.id)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationContainer;
