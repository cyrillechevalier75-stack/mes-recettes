import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { generateUUID } from '../utils/recipeUtils';
import type { ReactNode } from 'react';

export type Ingredient = {
    quantity: string; // Keeping as string to allow empty state in form, will parse to number for math
    unit: string;
    name: string;
};

export type Recipe = {
    id: string;
    title: string;
    baseServings: number;
    emoji: string;
    ingredients: Ingredient[];
    steps: string[];
    color: string;
    category?: string;
    created_at?: number;
    createdAt?: number;
};

type RecipeContextType = {
    recipes: Recipe[];
    loading: boolean;
    addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => void;
    updateRecipe: (id: string, recipe: Omit<Recipe, 'id' | 'createdAt'>) => void;
    deleteRecipe: (id: string) => void;
    refreshRecipes: () => Promise<void>;
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);


export function RecipeProvider({ children }: { children: ReactNode }) {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial Fetch
    useEffect(() => {
        fetchRecipes();
    }, []);

    async function fetchRecipes() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('recipes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setRecipes(data as unknown as Recipe[]); // Cast because DB might return slightly different types
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    }

    const addRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt'>) => {
        const newRecipe = {
            ...recipe,
            id: generateUUID(),
            created_at: Date.now(),
        };

        // Optimistic update
        setRecipes(prev => [newRecipe as unknown as Recipe, ...prev]);

        try {
            const { error } = await supabase.from('recipes').insert([newRecipe]);
            if (error) throw error;
        } catch (error) {
            console.error('Error adding recipe:', error);
            // Revert on error? For now, we keep it simple
            alert("Erreur lors de la sauvegarde en ligne !");
        }
    };

    const updateRecipe = async (id: string, updatedRecipe: Omit<Recipe, 'id' | 'createdAt'>) => {
        // Optimistic update
        setRecipes(prev => prev.map(recipe =>
            recipe.id === id
                ? { ...updatedRecipe, id: recipe.id, createdAt: recipe.createdAt || Date.now() } // Keep original creation date
                : recipe
        ));

        try {
            const { error } = await supabase
                .from('recipes')
                .update(updatedRecipe)
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating recipe:', error);
            alert("Erreur lors de la mise à jour !");
        }
    };

    const deleteRecipe = async (id: string) => {
        // Optimistic update
        setRecipes(prev => prev.filter(r => r.id !== id));

        try {
            const { error } = await supabase
                .from('recipes')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting recipe:', error);
            alert("Impossible de supprimer !");
        }
    };

    return (
        <RecipeContext.Provider value={{ recipes, loading, addRecipe, updateRecipe, deleteRecipe, refreshRecipes: fetchRecipes }}>
            {children}
        </RecipeContext.Provider>
    );
}

export function useRecipes() {
    const context = useContext(RecipeContext);
    if (!context) throw new Error('useRecipes must be used within a RecipeProvider');
    return context;
}
