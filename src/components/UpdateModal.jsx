import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import packageJson from '../../package.json';

const UpdateModal = () => {
    const { t } = useLanguage();
    const { addPersistentNotification, persistentNotifications } = useNotification();

    useEffect(() => {
        const currentVersion = packageJson.version;
        const savedVersion = localStorage.getItem('app_version');

        // Check if current version is newer than saved version
        // AND we haven't already notified about this specific version (optional, but good practice)
        if (!savedVersion || compareVersions(currentVersion, savedVersion) > 0) {

            // Check if we already have a notification for this version to avoid duplicates on reload
            // This is a simple check based on title/message unique string match or similar
            // For now, let's just check if ANY 'update' type notification exists? 
            // Or better, just add it. The context ID key will be unique, but we don't want to spam.
            // Let's rely on the fact that if the user clicks "Update" in AveragePage, it updates localStorage,
            // so this check won't pass on next load.

            // However, we need to make sure we don't add it EVERY time they refresh if they haven't updated yet.
            // We can use session storage or just check if it's already in the list.

            // Enhanced duplicate check: Check specifically for 'system_update' type AND the specific version.
            // Also ensure we are checking the LATEST list of notifications.
            const isDuplicate = persistentNotifications.some(n =>
                n.type === 'system_update' && n.version === currentVersion
            );

            if (!isDuplicate) {
                addPersistentNotification({
                    id: `system_update_${currentVersion}`, // Deterministic ID to prevent duplicates
                    title: 'Nova Atualização Disponível',
                    message: `A versão ${currentVersion} já está disponível. Clique para atualizar.`,
                    type: 'system_update',
                    version: currentVersion,
                    actionLink: '/update'
                });
            }
        }
    }, [addPersistentNotification, persistentNotifications]); // Dependencies might cause loops if not careful, but persistentNotifications is stable enough or we filter.

    // Helper to compare versions
    const compareVersions = (v1, v2) => {
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

    return null; // No UI, just logic
};

export default UpdateModal;
