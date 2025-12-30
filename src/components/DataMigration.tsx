import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useRecipes } from '../context/RecipeContext';
import { CloudUpload, Check, AlertCircle } from 'lucide-react';

export function DataMigration() {
    const { recipes } = useRecipes(); // These are Cloud recipes
    const [localCount, setLocalCount] = useState(0);
    const [migrating, setMigrating] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        // Check local storage for legacy data
        const stored = localStorage.getItem('my-recipes-v2');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setLocalCount(parsed.length);
                }
            } catch (e) {
                console.error("Error parsing local recipes", e);
            }
        }
    }, [recipes]); // Re-check when cloud recipes change (not strictly necessary but safe)

    const handleMigration = async () => {
        setMigrating(true);
        const stored = localStorage.getItem('my-recipes-v2');
        if (!stored) return;

        try {
            const localRecipes = JSON.parse(stored);

            // Insert all into Supabase
            // We strip 'id' to let Supabase/Crypto generate new ones OR we keep them if they are UUIDs. 
            // Better to keep them to avoid dupes if re-run, but Supabase might reject if ID exists.
            // Let's assume we want to keep them.

            const toInsert = localRecipes.map((r: any) => ({
                ...r,
                created_at: r.createdAt || Date.now() // Map format
            }));

            const { error } = await supabase.from('recipes').upsert(toInsert);

            if (error) throw error;

            setDone(true);
            setLocalCount(0);
            localStorage.removeItem('my-recipes-v2'); // Clear after success
            window.location.reload(); // Reload to fetch new data via Context
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la migration. Vérifie la console.");
        } finally {
            setMigrating(false);
        }
    };

    if (localCount === 0 && !done) return null;

    return (
        <div className="fixed bottom-24 left-6 right-6 z-50">
            <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {done ? (
                        <div className="bg-green-500 p-2 rounded-full"><Check size={20} /></div>
                    ) : (
                        <div className="bg-orange-500 p-2 rounded-full animate-pulse"><AlertCircle size={20} /></div>
                    )}
                    <div>
                        <h3 className="font-bold text-sm">
                            {done ? "Migration réussie !" : "Recettes locales détectées"}
                        </h3>
                        <p className="text-xs text-gray-400">
                            {done ? "Tes recettes sont dans le cloud." : `${localCount} recette(s) à sauver en ligne.`}
                        </p>
                    </div>
                </div>

                {!done && (
                    <button
                        onClick={handleMigration}
                        disabled={migrating}
                        className="bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {migrating ? 'Envoi...' : <><CloudUpload size={14} /> Sauver</>}
                    </button>
                )}
            </div>
        </div>
    );
}
