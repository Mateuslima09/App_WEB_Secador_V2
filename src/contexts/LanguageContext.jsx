import React, { createContext, useContext, useState } from 'react';

const translations = {
    pt: {
        menu: {
            average: 'Média',
            inversion: 'Inversão',
            history: 'Histórico',
            settings: 'Configurações',
        },
        common: {
            calculate: 'Calcular',
            result: 'Resultado',
            add: 'Adicionar',
            clear: 'Limpar',
            save: 'Salvar',
            delete: 'Excluir',
            back: 'Voltar',
            moisture: 'Umidade',
            date: 'Data',
            time: 'Hora',
            cancel: 'Cancela',
            confirm: 'Confirma',
            are_you_sure: 'Tem certeza?',
            confirm_clear_history: 'Quer mesmo apagar o histórico?',
        },
        average: {
            title: 'Média de Umidades',
            placeholder: 'Digite a umidade (ex: 12.5)',
            current_values: 'Valores Adicionados',
            average_is: 'A média é:',
        },
        inversion: {
            title: 'Verificador de Inversão',
            initial_moisture: 'Umidade Inicial',
            perten_moisture: 'Umidade Perten',
            check: 'Verificar',
            allowed: 'LIBERADO PARA INVERSÃO',
            not_allowed: 'NÃO LIBERADO',
            target: 'Umidade alvo (Metade)',
            limit: 'Limite maximo (Alvo + 2.5)',
            reasons: {
                perten_too_high: 'Perten acima de 25%',
                above_inversion_limit: 'Acima do limite de inversão',
                within_limits: 'Dentro dos parâmetros',
                invalid_input: 'Entrada inválida',
            }
        },
        settings: {
            title: 'Configurações',
            theme: 'Tema',
            dark_mode: 'Modo Escuro',
            language: 'Idioma',
            history: 'Histórico',
            clear_history: 'Limpar Histórico',
            history_cleared: 'Histórico limpo com sucesso!',
            system: 'Sistema',
            update_app: 'Atualizar App',
            clear_data: 'Limpar Dados',
            data_cleared: 'Dados limpos! O app será reiniciado.',
            auto_save: 'Salvar Automático',
            history_full: 'Histórico Cheio! Limpe para salvar.',
            history_storage: 'Armazenamento',
            history_description: 'Gerencie seu histórico de cálculos.',
            no_history_yet: 'Nenhum histórico ainda',
        }
    },
    en: {
        menu: {
            average: 'Average',
            inversion: 'Inversion',
            history: 'History',
            settings: 'Settings',
        },
        common: {
            calculate: 'Calculate',
            result: 'Result',
            add: 'Add',
            clear: 'Clear',
            save: 'Save',
            delete: 'Delete',
            back: 'Back',
            moisture: 'Moisture',
            date: 'Date',
            time: 'Time',
            cancel: 'Cancel',
            confirm: 'Confirm',
            are_you_sure: 'Are you sure?',
            confirm_clear_history: 'Do you really want to clear the history?',
        },
        average: {
            title: 'Moisture Average',
            placeholder: 'Enter moisture (e.g., 12.5)',
            current_values: 'Added Values',
            average_is: 'Average is:',
        },
        inversion: {
            title: 'Inversion Checker',
            initial_moisture: 'Initial Moisture',
            perten_moisture: 'Perten Moisture',
            check: 'Check',
            allowed: 'APPROVED FOR INVERSION',
            not_allowed: 'NOT APPROVED',
            target: 'Target Moisture (Half)',
            limit: 'Max Limit (Target + 2.5)',
            reasons: {
                perten_too_high: 'Perten above 25%',
                above_inversion_limit: 'Above inversion limit',
                within_limits: 'Within parameters',
                invalid_input: 'Invalid input',
            }
        },
        settings: {
            title: 'Settings',
            theme: 'Theme',
            dark_mode: 'Dark Mode',
            language: 'Language',
            history: 'History',
            clear_history: 'Clear History',
            history_cleared: 'History cleared successfully!',
            system: 'System',
            update_app: 'Update App',
            clear_data: 'Clear Data',
            data_cleared: 'Data cleared! App will restart.',
            auto_save: 'Auto Save',
            history_full: 'History Full! Clear to save.',
            history_storage: 'Storage',
            history_description: 'Manage your calculation history.',
            no_history_yet: 'No history yet',
        }
    },
    es: {
        menu: {
            average: 'Promedio',
            inversion: 'Inversión',
            history: 'Historial',
            settings: 'Configuración',
        },
        common: {
            calculate: 'Calcular',
            result: 'Resultado',
            add: 'Agregar',
            clear: 'Limpiar',
            save: 'Guardar',
            delete: 'Eliminar',
            back: 'Volver',
            moisture: 'Humedad',
            date: 'Fecha',
            time: 'Hora',
            cancel: 'Cancelar',
            confirm: 'Confirmar',
            are_you_sure: '¿Estás seguro?',
            confirm_clear_history: '¿Realmente deseas borrar el historial?',
        },
        average: {
            title: 'Promedio de Humedad',
            placeholder: 'Ingrese humedad (ej: 12.5)',
            current_values: 'Valores Agregados',
            average_is: 'El promedio es:',
        },
        inversion: {
            title: 'Verificador de Inversión',
            initial_moisture: 'Humedad Inicial',
            perten_moisture: 'Humedad Perten',
            check: 'Verificar',
            allowed: 'APROBADO PARA INVERSIÓN',
            not_allowed: 'NO APROBADO',
            target: 'Humedad objetivo (Mitad)',
            limit: 'Límite máx (Objetivo + 2.5)',
            reasons: {
                perten_too_high: 'Perten superior al 25%',
                above_inversion_limit: 'Por encima del límite',
                within_limits: 'Dentro de parámetros',
                invalid_input: 'Entrada inválida',
            }
        },
        settings: {
            title: 'Configuración',
            theme: 'Tema',
            dark_mode: 'Modo Oscuro',
            language: 'Idioma',
            history: 'Historial',
            clear_history: 'Borrar Historial',
            history_cleared: '¡Historial borrado con éxito!',
            system: 'Sistema',
            update_app: 'Actualizar App',
            clear_data: 'Borrar Datos',
            data_cleared: '¡Datos borrados! La app se reiniciará.',
            auto_save: 'Guardado Automático',
            history_full: '¡Historial Lleno! Borrar para guardar.',
            history_storage: 'Almacenamiento',
            history_description: 'Administra tu historial de cálculos.',
            no_history_yet: 'Sin historial aún',
        }
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('pt');

    const t = (path) => {
        const keys = path.split('.');
        let current = translations[language];
        for (const key of keys) {
            if (current[key] === undefined) return path;
            current = current[key];
        }
        return current;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
