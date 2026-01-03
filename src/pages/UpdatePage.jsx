import React from 'react';
import { RefreshCw, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import packageJson from '../../package.json';
import { changelog } from '../utils/changelog';

const UpdatePage = () => {
    const { t } = useLanguage();
    const { addPersistentNotification } = useNotification();
    const currentVersion = packageJson.version;
    const [savedVersion, setSavedVersion] = React.useState(localStorage.getItem('app_version') || '1.0.0');
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [statusText, setStatusText] = React.useState('');

    const compareVersions = (v1, v2) => {
        if (!v1 || !v2) return 0;
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const p1 = parts1[i] || 0;
            const p2 = parts2[i] || 0;
            if (p1 > p2) return 1;
            if (p1 < p2) return -1;
        }
        return 0;
    };

    const hasUpdate = compareVersions(currentVersion, savedVersion) > 0;

    const handleUpdate = () => {
        setIsUpdating(true);
        setProgress(0);
        setStatusText('Iniciando download...');

        // Simulation parameters
        const totalDuration = 4000; // 4 seconds total
        const intervalTime = 50;
        const steps = totalDuration / intervalTime;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            const newProgress = Math.min((currentStep / steps) * 100, 100);
            setProgress(newProgress);

            // Update status text based on progress
            if (newProgress < 30) {
                setStatusText('Baixando pacote de atualização...');
            } else if (newProgress < 60) {
                setStatusText('Descompactando arquivos...');
            } else if (newProgress < 90) {
                setStatusText('Instalando atualização...');
            } else {
                setStatusText('Finalizando...');
            }

            if (currentStep >= steps) {
                clearInterval(interval);

                // Complete update
                setTimeout(() => {
                    localStorage.setItem('app_version', currentVersion);
                    setSavedVersion(currentVersion);

                    addPersistentNotification({
                        id: `system_update_done_${currentVersion}`,
                        title: t('common.updated_title') || 'Sistema Atualizado',
                        message: `${t('common.updated_msg') || 'O sistema foi atualizado para a versão'} ${currentVersion}`,
                        type: 'success'
                    });

                    window.location.reload();
                }, 500);
            }
        }, intervalTime);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="glass-panel p-6">
                <div className="flex items-center gap-3 mb-4">
                    <RefreshCw size={24} className="text-[var(--color-primary)]" />
                    <h2 className="text-2xl font-bold gradient-text">
                        Atualização do Sistema
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-[var(--color-bg)]/30 p-4 rounded-xl border border-[var(--color-border)]">
                    <div className="flex gap-8">
                        <div className="text-center">
                            <p className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">Versão Atual</p>
                            <p className="text-xl font-mono font-bold text-[var(--color-text)]">{savedVersion}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">Nova Versão</p>
                            <p className={`text-xl font-mono font-bold ${hasUpdate ? 'text-green-500' : 'text-[var(--color-text)]'}`}>
                                {currentVersion}
                            </p>
                        </div>
                    </div>

                    {hasUpdate ? (
                        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                            {!isUpdating ? (
                                <>
                                    <div className="flex items-center gap-2 text-yellow-500 text-sm">
                                        <AlertCircle size={16} />
                                        <span>Atualização Disponível</span>
                                    </div>
                                    <button
                                        onClick={handleUpdate}
                                        className="btn-primary animate-pulse"
                                    >
                                        <RefreshCw size={18} className="mr-2" />
                                        Atualizar Agora
                                    </button>
                                </>
                            ) : (
                                <div className="w-full md:w-64">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-[var(--color-primary)] font-medium animate-pulse">{statusText}</span>
                                        <span className="text-[var(--color-text-secondary)]">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 bg-[var(--color-bg)] rounded-full overflow-hidden border border-[var(--color-border)]">
                                        <div
                                            className="h-full bg-[var(--color-primary)] transition-all duration-75 relative overflow-hidden"
                                            style={{ width: `${progress}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_1s_infinite] skew-x-12"></div>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <Loader className="animate-spin inline-block text-[var(--color-primary)]" size={16} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle size={20} />
                            <span className="font-medium">O sistema está atualizado</span>
                        </div>
                    )}
                </div>

                {hasUpdate && (
                    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <h4 className="font-bold text-yellow-500 mb-2">O que há de novo na v{currentVersion}</h4>
                        <ul className="list-disc list-inside text-sm text-[var(--color-text-secondary)] space-y-1">
                            {(changelog.find(c => c.version === currentVersion)?.changes || []).map((change, i) => (
                                <li key={i}>{change.text[useLanguage()?.language || 'pt'] || change.text['pt']}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdatePage;
