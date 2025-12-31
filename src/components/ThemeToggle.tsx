import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const themes: { id: 'light' | 'dark' | 'system', icon: any, label: string }[] = [
        { id: 'light', icon: Sun, label: 'Clair' },
        { id: 'system', icon: Monitor, label: 'Système' },
        { id: 'dark', icon: Moon, label: 'Sombre' },
    ];

    return (
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl gap-1">
            {themes.map((t) => {
                const Icon = t.icon;
                const isActive = theme === t.id;
                return (
                    <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`
                            relative p-2 rounded-lg transition-all
                            ${isActive
                                ? 'text-orange-600 dark:text-orange-400'
                                : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                            }
                        `}
                        aria-label={t.label}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeTheme"
                                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <Icon size={18} className="relative z-10" />
                    </button>
                );
            })}
        </div>
    );
}
