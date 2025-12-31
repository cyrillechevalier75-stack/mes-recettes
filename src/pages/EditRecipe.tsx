import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';
import type { Ingredient } from '../context/RecipeContext';
import { sortIngredients } from '../utils/recipeUtils';
import { ChevronLeft, Save, Users } from 'lucide-react';
import { IngredientEditor } from '../components/IngredientEditor';
import { StepEditor } from '../components/StepEditor';
import { CategoryPicker } from '../components/CategoryPicker';

export function EditRecipe() {
    const { id } = useParams<{ id: string }>();
    const { recipes, updateRecipe } = useRecipes();
    const navigate = useNavigate();

    // Load existing recipe
    const existingRecipe = recipes.find(r => r.id === id);

    const [title, setTitle] = useState('');
    const [emoji, setEmoji] = useState('🍳');
    const [baseServings, setBaseServings] = useState(4);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [steps, setSteps] = useState<string[]>([]);
    const [category, setCategory] = useState('');

    // Populate form on load
    useEffect(() => {
        if (existingRecipe) {
            setTitle(existingRecipe.title);
            setEmoji(existingRecipe.emoji);
            setBaseServings(existingRecipe.baseServings || 4);
            setIngredients(existingRecipe.ingredients || []);
            setSteps(existingRecipe.steps || []);
            setCategory(existingRecipe.category || '');
        }
    }, [existingRecipe]);

    if (!existingRecipe) {
        return <div className="p-10 text-center">Recette introuvable...</div>;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !id) return;

        const sortedIngredients = sortIngredients(ingredients);

        updateRecipe(id, {
            title,
            emoji,
            baseServings,
            ingredients: sortedIngredients,
            steps,
            color: 'bg-orange-100',
            category
        });
        navigate(`/recipe/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32 transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Modifier la recette</h1>
                <div className="w-10"></div>
            </header>

            <form onSubmit={handleSubmit} className="p-6 space-y-8 max-w-md mx-auto">

                {/* Title, Emoji & Servings */}
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-none">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Icône</label>
                            <input
                                type="text"
                                value={emoji}
                                onChange={(e) => setEmoji(e.target.value)}
                                className="w-16 h-16 text-center text-4xl bg-white dark:bg-gray-900 border-2 border-orange-100 dark:border-orange-900/50 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/20 outline-none transition-all"
                                maxLength={2}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nom du plat</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Pâtes Carbo..."
                                className="w-full h-16 px-4 text-lg font-semibold bg-white dark:bg-gray-900 border-2 border-orange-100 dark:border-orange-900/50 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/20 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nombre de parts</label>
                        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-1.5 rounded-xl border border-gray-200 dark:border-gray-800 w-max pr-4">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                                <Users size={18} />
                            </div>
                            <input
                                type="number"
                                min="1"
                                value={baseServings}
                                onChange={(e) => setBaseServings(parseInt(e.target.value) || 1)}
                                className="w-12 text-center font-bold outline-none text-gray-800 dark:text-gray-100 bg-transparent"
                            />
                            <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">pers.</span>
                        </div>
                    </div>

                    <CategoryPicker selected={category} onChange={setCategory} />
                </div>

                {/* Ingredients */}
                <IngredientEditor
                    ingredients={ingredients}
                    onChange={setIngredients}
                />

                {/* Steps */}
                <StepEditor
                    steps={steps}
                    onChange={setSteps}
                />

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-200 transform transition active:scale-95 flex items-center justify-center gap-2"
                >
                    <Save size={20} />
                    Mettre à jour
                </button>

            </form>
        </div>
    )
}
