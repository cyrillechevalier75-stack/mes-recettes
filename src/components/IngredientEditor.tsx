import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Ingredient } from '../context/RecipeContext';

interface IngredientEditorProps {
    ingredients: Ingredient[];
    onChange: (ingredients: Ingredient[]) => void;
}

export function IngredientEditor({ ingredients, onChange }: IngredientEditorProps) {
    const [newQty, setNewQty] = useState('');
    const [newUnit, setNewUnit] = useState('');
    const [newName, setNewName] = useState('');

    const handleAdd = () => {
        if (newName.trim()) {
            onChange([...ingredients, {
                quantity: newQty,
                unit: newUnit,
                name: newName.trim()
            }]);
            setNewQty('');
            setNewUnit('');
            setNewName('');
        }
    };

    const handleChange = (index: number, field: keyof Ingredient, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        onChange(newIngredients);
    };

    const handleDelete = (index: number) => {
        onChange(ingredients.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                🥗 Ingrédients <span className="text-sm font-normal text-gray-400 dark:text-gray-500">({ingredients.length})</span>
            </h2>

            {/* Add Row */}
            <div className="flex gap-2 items-end">
                <div className="w-20">
                    <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Qté</label>
                    <input
                        type="number"
                        value={newQty}
                        onChange={(e) => setNewQty(e.target.value)}
                        placeholder="500"
                        className="w-full px-3 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:border-orange-500 outline-none text-center font-medium dark:text-white"
                    />
                </div>
                <div className="w-20">
                    <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Unité</label>
                    <select
                        value={newUnit}
                        onChange={(e) => setNewUnit(e.target.value)}
                        className="w-full px-1 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:border-orange-500 outline-none text-center text-sm appearance-none dark:text-white"
                    >
                        <option value="">-</option>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="u">u</option>
                        <option value="cl">cl</option>
                        <option value="l">l</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Ingrédient</label>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
                        placeholder="Farine"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:border-orange-500 outline-none dark:text-white"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors mb-[1px]"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* List */}
            <ul className="space-y-2">
                {ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-50 dark:border-gray-800 animate-in slide-in-from-bottom-2 fade-in duration-300">
                        <div className="w-16">
                            <input
                                type="number"
                                value={ing.quantity}
                                onChange={(e) => handleChange(idx, 'quantity', e.target.value)}
                                className="w-full px-2 py-2 bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-orange-500 rounded-lg outline-none text-center font-bold text-orange-500 text-sm"
                                placeholder="100"
                            />
                        </div>
                        <div className="w-16">
                            <select
                                value={ing.unit}
                                onChange={(e) => handleChange(idx, 'unit', e.target.value)}
                                className="w-full px-1 py-2 bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-orange-500 rounded-lg outline-none text-center text-xs appearance-none font-medium text-gray-600 dark:text-gray-400"
                            >
                                <option value="">-</option>
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="u">u</option>
                                <option value="cl">cl</option>
                                <option value="l">l</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                value={ing.name}
                                onChange={(e) => handleChange(idx, 'name', e.target.value)}
                                className="w-full px-2 py-2 bg-transparent border-b border-transparent focus:border-orange-200 dark:focus:border-orange-900 outline-none text-gray-700 dark:text-gray-200 font-medium"
                                placeholder="Ingrédient..."
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleDelete(idx)}
                            className="text-gray-300 hover:text-red-500 p-2"
                        >
                            <X size={18} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
