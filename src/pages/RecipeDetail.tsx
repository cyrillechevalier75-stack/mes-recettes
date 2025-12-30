import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';
import { ChevronLeft, Trash2, Users, Minus, Plus, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function RecipeDetail() {
    const { id } = useParams<{ id: string }>();
    const { recipes, deleteRecipe } = useRecipes();
    const navigate = useNavigate();
    const recipe = recipes.find(r => r.id === id);
    const [activeStep, setActiveStep] = useState(0);

    // Scaling State
    const [servings, setServings] = useState(4);

    useEffect(() => {
        if (recipe) {
            setServings(recipe.baseServings || 4);
        }
    }, [recipe]);

    if (!recipe) {
        return <div className="p-6 text-center pt-20">Recette introuvable 😕</div>;
    }

    const handleDelete = () => {
        if (confirm('Supprimer cette recette ?')) {
            deleteRecipe(recipe.id);
            navigate('/');
        }
    };

    const handleUpdateServings = (delta: number) => {
        setServings(prev => Math.max(1, prev + delta));
    };

    const calculateQty = (baseQty: string) => {
        const qty = parseFloat(baseQty);
        if (isNaN(qty)) return baseQty; // Return original text if not a number

        const base = recipe.baseServings || 4;
        const result = (qty / base) * servings;

        // Round to avoid 0.30000000004
        return Math.round(result * 100) / 100;
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            {/* Header */}
            <motion.div
                layoutId={`header-${recipe.id}`}
                className="relative h-72 bg-orange-100 flex items-center justify-center overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 z-10"></div>
                <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-9xl relative z-0"
                >
                    {recipe.emoji}
                </motion.span>

                <div className="absolute top-4 left-4 z-20">
                    <button onClick={() => navigate(-1)} className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                </div>
                <div className="absolute top-4 right-4 z-20 flex gap-3">
                    <button onClick={() => navigate(`/edit/${recipe.id}`)} className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors">
                        <Pencil size={24} />
                    </button>
                    <button onClick={handleDelete} className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-red-500/80 transition-colors">
                        <Trash2 size={24} />
                    </button>
                </div>

                <div className="absolute bottom-8 left-6 right-6 z-20">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl font-extrabold text-white drop-shadow-md leading-tight"
                    >
                        {recipe.title}
                    </motion.h1>
                </div>
            </motion.div>

            <div className="p-6 -mt-10 relative z-30 bg-gray-50 rounded-t-[2rem] space-y-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">

                {/* Scaling Control */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-700 font-bold">
                        <Users className="text-orange-500" size={20} />
                        <span>Parts</span>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1">
                        <button
                            onClick={() => handleUpdateServings(-1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 active:scale-95 transition"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="w-6 text-center font-bold text-lg">{servings}</span>
                        <button
                            onClick={() => handleUpdateServings(1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 active:scale-95 transition"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                {/* Ingredients */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <h2 className="text-2xl font-bold text-gray-900">Ingrédients</h2>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <ul className="space-y-4">
                            {recipe.ingredients.map((ing, i) => (
                                <li key={i} className="flex items-center gap-4 text-gray-700">
                                    <div className="w-3 h-3 bg-orange-400 rounded-full flex-none shadow-sm" />
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-bold text-gray-900">
                                            {calculateQty(ing.quantity)}
                                        </span>
                                        <span className="text-gray-500 font-medium text-sm">{ing.unit}</span>
                                        <span className="text-lg font-medium ml-1">{ing.name}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Steps */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Préparation</h2>
                    <div className="space-y-4">
                        {recipe.steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                onClick={() => setActiveStep(i)}
                                className={`p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer ${activeStep === i ? 'bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-200 transform scale-[1.02]' : 'bg-white border-transparent shadow-sm text-gray-600 hover:border-orange-100'}`}
                            >
                                <div className="flex gap-5">
                                    <span className={`text-4xl font-extrabold opacity-40 ${activeStep === i ? 'text-white' : 'text-orange-200'}`}>{i + 1}</span>
                                    <p className="leading-relaxed text-lg pt-1 font-medium">{step}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
