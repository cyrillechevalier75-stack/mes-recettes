import { useState } from 'react';
import { useRecipes } from '../context/RecipeContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X } from 'lucide-react';

export function Home() {
    const { recipes, loading } = useRecipes();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin text-4xl">🍳</div>
            </div>
        );
    }
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Get unique categories sorted alphabetically
    const categories = Array.from(new Set(recipes.map(r => r.category).filter(Boolean) as string[])).sort();

    const filteredRecipes = recipes.filter(r => {
        const matchesCategory = !selectedCategory || r.category === selectedCategory;
        const matchesSearch = !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <header className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-6 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Mes Recettes</h1>
                        <p className="text-gray-500 text-sm">Qu'est-ce qu'on mange ? 😋</p>
                    </div>
                    <Link to="/add" className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg shadow-orange-200 transition-all active:scale-95">
                        <Plus size={24} />
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher une recette..."
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-100 focus:bg-white rounded-2xl py-3 pl-12 pr-12 text-sm font-medium transition-all outline-none"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Category Filter */}
                {categories.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 hide-scrollbar pt-2">
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${!selectedCategory
                                ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            Toutes
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </header>

            <div className="p-6">
                {recipes.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <div className="text-5xl mb-4">🥘</div>
                        <p className="text-lg font-medium">Aucune recette pour le moment...</p>
                        <p className="text-sm mt-2 text-gray-400">Clique sur + pour commencer !</p>
                    </div>
                ) : filteredRecipes.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 animate-in fade-in">
                        <p className="text-lg">Aucune recette dans {selectedCategory}...</p>
                        <button onClick={() => setSelectedCategory('')} className="text-orange-500 font-medium mt-2 hover:underline">
                            Voir toutes les recettes
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredRecipes.map((recipe) => (
                                <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="block">
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow relative overflow-hidden"
                                    >
                                        <div className="text-4xl w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center flex-none">
                                            {recipe.emoji}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="font-bold text-gray-800 text-lg truncate">{recipe.title}</h2>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <span>{recipe.ingredients?.length || 0} ingrédients</span>
                                                <span>•</span>
                                                <span>{recipe.baseServings} pers.</span>
                                            </div>
                                        </div>
                                        {recipe.category && (
                                            <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-bl-xl uppercase tracking-wider">
                                                {recipe.category}
                                            </div>
                                        )}
                                    </motion.div>
                                </Link>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
