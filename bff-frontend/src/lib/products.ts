import { resolveMediaUrl, type ApiInteractiveExperience, type ApiProduct, type ApiRecipe } from '@/services/api';

export type Category = string;

export interface Recipe {
  slug: string;
  name: string;
  description: string;
  videoUrl: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  calories?: string;
}

export interface IngredientBenefit {
  name: string;
  emoji: string;
  description: string;
  benefits: string;
  whyIncluded: string;
  freezeDrying: string;
}

export interface InteractiveExperience {
  title: string;
  description: string;
  features: string[];
  videoUrl: string;
  ingredients: IngredientBenefit[];
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  category: Category;
  packImage: string;
  packImageTransparent?: string;
  ingredientImage: string;
  ingredientImageTransparent?: string;
  bgRemovalStatus?: string;
  accent: string;
  price: string;
  organic?: boolean;
  whiteLabel?: boolean;
  blurb: string;
  recipe?: Recipe;
  interactiveExperience?: InteractiveExperience;
}

const toRecipe = (recipe?: ApiRecipe | null): Recipe | undefined => recipe ? {
  slug: recipe.slug,
  name: recipe.title,
  description: recipe.description,
  videoUrl: resolveMediaUrl(recipe.video_url),
  prepTime: recipe.prep_time,
  difficulty: recipe.difficulty,
  ingredients: recipe.ingredients,
  calories: recipe.calories || undefined,
} : undefined;

const toInteractiveExperience = (experience?: ApiInteractiveExperience | null): InteractiveExperience | undefined => experience ? {
  title: experience.title,
  description: experience.description,
  features: experience.features,
  videoUrl: resolveMediaUrl(experience.video_url),
  ingredients: experience.ingredient_benefits.map((ingredient) => ({
    name: ingredient.name || 'Ingredient',
    emoji: ingredient.emoji || '',
    description: ingredient.description || '',
    benefits: ingredient.benefits || '',
    whyIncluded: ingredient.whyIncluded || ingredient.why_included || '',
    freezeDrying: ingredient.freezeDrying || ingredient.freeze_drying || '',
  })),
} : undefined;

export const mapApiProduct = (product: ApiProduct): Product => ({
  id: product.id,
  sku: product.sku,
  slug: product.slug,
  name: product.name,
  category: product.category_name || 'Uncategorized',
  packImage: resolveMediaUrl(product.pack_image),
  packImageTransparent: resolveMediaUrl(product.pack_image_transparent) || undefined,
  ingredientImage: resolveMediaUrl(product.ingredient_image),
  ingredientImageTransparent: resolveMediaUrl(product.ingredient_image_transparent) || undefined,
  bgRemovalStatus: product.bg_removal_status || undefined,
  accent: product.accent_color,
  price: `₹${Number(product.price_inr).toLocaleString('en-IN')}`,
  organic: product.is_organic,
  whiteLabel: product.white_label_available,
  blurb: product.blurb,
  recipe: toRecipe(product.recipe),
  interactiveExperience: toInteractiveExperience(product.interactive_experience),
});

