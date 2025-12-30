import type { Ingredient } from '../context/RecipeContext';

const UNIT_VALUES: Record<string, number> = {
    'kg': 1000,
    'g': 1,
    'l': 100, // User specified 1l = 100cl context, effectively making cl the base for liquids if we treat them separately, but let's just stick to a magnitude scale. 
    // Wait, standard is 1l = 1000ml = 100cl. 
    // If user explicitly said "1l=100cl", then 1l is 100 times the "cl" unit. 
    // If 'cl' is 1, then 'l' is 100.
    // If 'g' is 1, 'kg' is 1000. 
    // We can try to normalize to 'g' and 'cl' as 1. 
    'cl': 1,
    'u': 1, // unit
    '': 1
};

export function sortIngredients(ingredients: Ingredient[]): Ingredient[] {
    return [...ingredients].sort((a, b) => {
        const valA = parseFloat(a.quantity) || 0;
        const valB = parseFloat(b.quantity) || 0;

        const multA = UNIT_VALUES[a.unit] || 1;
        const multB = UNIT_VALUES[b.unit] || 1;

        const normA = valA * multA;
        const normB = valB * multB;

        return normB - normA;
    });
}

export function generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
