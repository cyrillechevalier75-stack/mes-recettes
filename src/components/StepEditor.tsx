import { useState } from 'react';
import { Plus, X, ArrowUp, ArrowDown } from 'lucide-react';

interface StepEditorProps {
    steps: string[];
    onChange: (steps: string[]) => void;
}

export function StepEditor({ steps, onChange }: StepEditorProps) {
    const [newStep, setNewStep] = useState('');

    const handleAdd = () => {
        if (newStep.trim()) {
            onChange([...steps, newStep.trim()]);
            setNewStep('');
        }
    };

    const handleChange = (index: number, value: string) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        onChange(newSteps);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newSteps = [...steps];
        if (direction === 'up' && index > 0) {
            [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]];
        } else if (direction === 'down' && index < newSteps.length - 1) {
            [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
        }
        onChange(newSteps);
    };

    const handleDelete = (index: number) => {
        onChange(steps.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                📝 Étapes <span className="text-sm font-normal text-gray-400 dark:text-gray-500">({steps.length})</span>
            </h2>

            <div className="flex gap-2 items-start">
                <textarea
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    placeholder="Décrire l'étape..."
                    className="flex-1 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:border-orange-500 outline-none min-h-[80px] resize-none dark:text-white"
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors mt-1"
                >
                    <Plus size={24} />
                </button>
            </div>

            <div className="space-y-3">
                {steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-50 dark:border-gray-800 relative group">
                        <div className="flex flex-col gap-1 mt-0.5">
                            {idx > 0 && (
                                <button type="button" onClick={() => handleMove(idx, 'up')} className="text-gray-300 hover:text-orange-500 p-0.5"><ArrowUp size={14} /></button>
                            )}
                            {idx < steps.length - 1 && (
                                <button type="button" onClick={() => handleMove(idx, 'down')} className="text-gray-300 dark:text-gray-600 hover:text-orange-500 p-0.5"><ArrowDown size={14} /></button>
                            )}
                        </div>
                        <div className="flex-none w-6 h-6 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                            {idx + 1}
                        </div>

                        {/* Editable Step Area */}
                        <textarea
                            value={step}
                            onChange={(e) => handleChange(idx, e.target.value)}
                            className="flex-1 text-gray-700 dark:text-gray-200 text-sm leading-relaxed outline-none border-b border-transparent focus:border-orange-200 dark:focus:border-orange-900 bg-transparent resize-none overflow-hidden min-h-[1.5em]"
                            rows={Math.max(1, Math.ceil(step.length / 40))}
                        />

                        <button
                            type="button"
                            onClick={() => handleDelete(idx)}
                            className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
