import { useEffect, useState } from 'react';
import { api, type ApiCategory } from '@/services/api';
import { mapApiProduct, type Product } from '@/lib/products';

interface CatalogState {
  products: Product[];
  categories: ApiCategory[];
  isLoading: boolean;
  error: string | null;
}

export function useCatalogData(): CatalogState {
  const [state, setState] = useState<CatalogState>({ products: [], categories: [], isLoading: true, error: null });

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [productResponse, categories, recipes, experiences] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getRecipes(),
          api.getInteractiveExperiences(),
        ]);
        const apiProducts = Array.isArray(productResponse) ? productResponse : productResponse.results;
        const categoryList = Array.isArray(categories) ? categories : [];
        const recipeByProduct = new Map(recipes.map((recipe) => [recipe.product, recipe]));
        const experienceByProduct = new Map(experiences.map((experience) => [experience.product, experience]));
        const products = apiProducts.map((product) => mapApiProduct({
          ...product,
          recipe: product.recipe || recipeByProduct.get(product.id),
          interactive_experience: product.interactive_experience || experienceByProduct.get(product.id),
        }));
        if (active) setState({ products, categories: categoryList, isLoading: false, error: null });
      } catch (error) {
        if (active) setState((current) => ({ ...current, isLoading: false, error: error instanceof Error ? error.message : 'Unable to load catalog.' }));
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  return state;
}
