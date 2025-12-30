import { useState, useEffect } from 'react';
import { Tag, Check } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';

interface CategoryPickerProps {
    selected: string;
    onChange: (category: string) => void;
}

export function CategoryPicker({ selected, onChange }: CategoryPickerProps) {
    const { recipes } = useRecipes();
    const [categories, setCategories] = useState<string[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        // Extract unique categories from existing recipes
        const unique = Array.from(new Set(recipes.map(r => r.category).filter(Boolean) as string[]));
        setCategories(unique.sort());
    }, [recipes]);

    const handleCreate = () => {
        if (newCategory.trim()) {
            onChange(newCategory.trim());
            setIsCreating(false);
            setNewCategory('');
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">Catégorie</label>

            <div className="flex flex-wrap gap-2">
                {/* Default/None */}
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${!selected
                        ? 'bg-orange-100 text-orange-600 border-orange-200'
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                        }`}
                >
                    Toutes
                </button>

                {/* Existing Categories */}
                {categories.map(cat => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => onChange(cat)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${selected === cat
                            ? 'bg-orange-100 text-orange-600 border-orange-200'
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        {cat}
                    </button>
                ))}

                {/* Create New */}
                {isCreating ? (
                    <div className="flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
                        <input
                            autoFocus
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onBlur={() => !newCategory && setIsCreating(false)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleCreate();
                                }
                            }}
                            placeholder="Nouvelle..."
                            className="px-3 py-1.5 rounded-full text-sm border-2 border-orange-200 outline-none w-32 focus:border-orange-400"
                        />
                        <button
                            type="button"
                            onClick={handleCreate}
                            className="p-1 text-orange-600 hover:bg-orange-100 rounded-full"
                        >
                            <Check size={16} />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsCreating(true)}
                        className="px-3 py-1.5 rounded-full text-sm font-medium text-gray-400 border border-dashed border-gray-300 hover:text-orange-500 hover:border-orange-300 transition-colors flex items-center gap-1"
                    >
                        <Tag size={12} />
                        Autre...
                    </button>
                )}
            </div>
        </div>
    );
}
