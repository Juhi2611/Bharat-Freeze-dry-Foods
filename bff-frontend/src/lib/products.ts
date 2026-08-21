import packBlueberry from "@/assets/pack-blueberry.jpg";
import ingBlueberry from "@/assets/ingredient-blueberry.jpg";
import packMango from "@/assets/pack-mango.jpg";
import ingMango from "@/assets/ingredient-mango.jpg";
import packStrawberry from "@/assets/pack-strawberry.jpg";
import ingStrawberry from "@/assets/ingredient-strawberry.jpg";
import packSpinach from "@/assets/pack-spinach.jpg";
import ingSpinach from "@/assets/ingredient-spinach.jpg";
import packTomato from "@/assets/pack-tomato.jpg";
import ingTomato from "@/assets/ingredient-tomato.jpg";
import packCorn from "@/assets/pack-corn.jpg";
import ingCorn from "@/assets/ingredient-corn.jpg";
import packRedGravy from "@/assets/pack-red-gravy.jpg";
import ingRedGravy from "@/assets/ingredient-red-gravy.jpg";
import packWhiteGravy from "@/assets/pack-white-gravy.jpg";
import ingWhiteGravy from "@/assets/ingredient-white-gravy.jpg";
import packGarlicGravy from "@/assets/pack-garlic-gravy.jpg";
import ingGarlicGravy from "@/assets/ingredient-garlic-gravy.jpg";
import packDogChicken from "@/assets/pack-dog-chicken.jpg";
import ingDogChicken from "@/assets/ingredient-dog-chicken.jpg";
import packDogLiver from "@/assets/pack-dog-liver.jpg";
import ingDogLiver from "@/assets/ingredient-dog-liver.jpg";
import packDogSalmon from "@/assets/pack-dog-salmon.jpg";
import ingDogSalmon from "@/assets/ingredient-dog-salmon.jpg";
import packTurmeric from "@/assets/pack-turmeric.jpg";
import ingTurmeric from "@/assets/ingredient-turmeric.jpg";
import packMoringa from "@/assets/pack-moringa.jpg";
import ingMoringa from "@/assets/ingredient-moringa.jpg";
import packBiryani from "@/assets/pack-biryani.jpg";
import ingBiryani from "@/assets/ingredient-biryani.jpg";
import recipeWhiteGravy from "@/assets/recipe-white-gravy.mp4";
import videoDogLiver from "@/assets/video-dog-liver.mp4";

export type Category =
  | "Fruits"
  | "Vegetables"
  | "Gravies"
  | "Pet Food"
  | "Spices"
  | "Superfoods"
  | "Pre-Cooked Meals";

export interface Recipe {
  slug: string;
  name: string;
  description: string;
  videoUrl: string;
  prepTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
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
  name: string;
  category: Category;
  packImage: string;
  ingredientImage: string;
  accent: string;
  price: string;
  organic?: boolean;
  whiteLabel?: boolean;
  blurb: string;
  recipe?: Recipe;
  interactiveExperience?: InteractiveExperience;
}

export const PRODUCTS: Product[] = [
  { id: "mango", name: "Alphonso Mango", category: "Fruits", packImage: packMango, ingredientImage: ingMango, accent: "#E1B84A", price: "₹349", whiteLabel: true, blurb: "Peak-season Alphonso, flash-frozen and freeze-dried into crunchy sunshine." },
  { id: "strawberry", name: "Strawberry", category: "Fruits", packImage: packStrawberry, ingredientImage: ingStrawberry, accent: "#E14A6E", price: "₹329", whiteLabel: true, blurb: "Ripe strawberries, locked in — same colour, same bite, none of the water." },
  { id: "blueberry", name: "Blueberry", category: "Fruits", packImage: packBlueberry, ingredientImage: ingBlueberry, accent: "#4FA8D8", price: "₹499", whiteLabel: true, blurb: "Antioxidant-rich blueberries preserved at the peak of freshness." },

  { id: "spinach", name: "Organic Spinach", category: "Vegetables", packImage: packSpinach, ingredientImage: ingSpinach, accent: "#5FA755", price: "₹279", organic: true, blurb: "Baby spinach leaves, freeze-dried with every nutrient intact." },
  { id: "tomato", name: "Tomato", category: "Vegetables", packImage: packTomato, ingredientImage: ingTomato, accent: "#D94F3D", price: "₹259", blurb: "Vine-ripe tomatoes ready to rehydrate in seconds." },
  { id: "corn", name: "Sweet Corn", category: "Vegetables", packImage: packCorn, ingredientImage: ingCorn, accent: "#F0C24A", price: "₹269", organic: true, blurb: "Golden kernels — snack-crunchy dry, tender in seconds when soaked." },

  { id: "red-gravy", name: "Red Gravy Base", category: "Gravies", packImage: packRedGravy, ingredientImage: ingRedGravy, accent: "#C33B2E", price: "₹399", whiteLabel: true, blurb: "Chef-grade tomato-onion base. Just add hot water for restaurant curry." },
  { 
    id: "white-gravy", 
    name: "White Gravy Base", 
    category: "Gravies", 
    packImage: packWhiteGravy, 
    ingredientImage: ingWhiteGravy, 
    accent: "#E8D8B4", 
    price: "₹419", 
    whiteLabel: true, 
    blurb: "Cashew-cream royal base. Silky, freeze-dried, shelf-stable.",
    recipe: {
      slug: "white-gravy-pasta",
      name: "Creamy White Gravy Pasta",
      description: "A rich, velvety pasta made effortlessly with our premium freeze-dried cashew-cream base.",
      videoUrl: recipeWhiteGravy,
      prepTime: "10 mins",
      difficulty: "Easy",
      ingredients: ["1 pack BFF White Gravy Base", "200g Pasta", "150ml Hot Water", "Grated Parmesan", "Fresh Parsley"],
      calories: "450 kcal"
    }
  },
  { id: "garlic-gravy", name: "Garlic Gravy Base", category: "Gravies", packImage: packGarlicGravy, ingredientImage: ingGarlicGravy, accent: "#A97142", price: "₹389", whiteLabel: true, blurb: "Slow-roasted garlic gravy, freeze-dried at peak aroma." },

  { id: "turmeric", name: "Turmeric", category: "Spices", packImage: packTurmeric, ingredientImage: ingTurmeric, accent: "#E1832E", price: "₹229", blurb: "Freeze-dried at peak curcumin content. Vibrant, potent, whole." },
  { id: "moringa", name: "Moringa Superfood", category: "Superfoods", packImage: packMoringa, ingredientImage: ingMoringa, accent: "#8ABB4A", price: "₹549", organic: true, blurb: "Nutrient-dense moringa leaf, freeze-dried whole into fine powder." },
  { id: "biryani", name: "Biryani Ready Meal", category: "Pre-Cooked Meals", packImage: packBiryani, ingredientImage: ingBiryani, accent: "#D19A2E", price: "₹449", blurb: "Full-flavour biryani, cooked, freeze-dried, ready in 5 minutes." },
];

export const PET_FOODS: Product[] = [
  { id: "dog-chicken", name: "Chicken & Rice", category: "Pet Food", packImage: packDogChicken, ingredientImage: ingDogChicken, accent: "#D97B3D", price: "₹599", blurb: "Your Dog's BFF — real chicken & rice, freeze-dried, zero fillers." },
  { 
    id: "dog-liver", 
    name: "Vegetable & Liver", 
    category: "Pet Food", 
    packImage: packDogLiver, 
    ingredientImage: ingDogLiver, 
    accent: "#8B7F3E", 
    price: "₹579", 
    blurb: "Iron-rich liver with garden vegetables — a dog's dream, preserved.",
    recipe: {
      slug: "dog-liver-video",
      name: "BFF Vegetable & Liver",
      description: "Premium freeze-dried dog food made with nutritious vegetables and high-quality liver.",
      videoUrl: videoDogLiver,
      prepTime: "Ready to Serve",
      difficulty: "Easy",
      ingredients: ["Liver", "Carrot", "Green Peas", "Sweet Potato", "Broccoli", "Natural Herbs"]
    },
    interactiveExperience: {
      title: "BFF Vegetable & Liver",
      description: "Premium freeze-dried dog food made with nutritious vegetables and high-quality liver to provide a delicious, protein-rich meal while preserving natural nutrients through advanced freeze-drying technology.",
      features: [
        "Preparation Time: Ready to Serve",
        "Suitable For: Dogs",
        "High Protein",
        "Freeze-Dried Technology",
        "No Artificial Preservatives",
        "Long Shelf Life"
      ],
      videoUrl: videoDogLiver,
      ingredients: [
        { name: "Liver", emoji: "🥩", description: "High-quality, iron-rich protein source.", benefits: "Supports healthy muscles and energy levels.", whyIncluded: "Dogs love the rich, natural taste.", freezeDrying: "Preserves the delicate proteins without cooking damage." },
        { name: "Carrot", emoji: "🥕", description: "Crunchy, sweet, and nutrient-dense.", benefits: "Loaded with beta-carotene for eye health.", whyIncluded: "Provides natural dietary fiber.", freezeDrying: "Locks in the vibrant orange color and sweet flavor." },
        { name: "Green Peas", emoji: "🫛", description: "Small but mighty green powerhouses.", benefits: "Great source of vitamins A, K, and B.", whyIncluded: "Adds plant-based protein and essential nutrients.", freezeDrying: "Keeps them farm-fresh and crunchy." },
        { name: "Sweet Potato", emoji: "🥔", description: "Complex carbohydrates that digest slowly.", benefits: "Excellent for digestion and blood sugar regulation.", whyIncluded: "A highly palatable base ingredient.", freezeDrying: "Maintains optimal texture and nutrient density." },
        { name: "Broccoli", emoji: "🥦", description: "Nutrient-packed green florets.", benefits: "Rich in antioxidants and vitamin C.", whyIncluded: "Supports immune system health.", freezeDrying: "Retains the delicate phytonutrients completely." },
        { name: "Natural Herbs", emoji: "🌿", description: "A proprietary blend of pet-safe botanicals.", benefits: "Aids digestion and freshens breath.", whyIncluded: "Enhances the natural aroma of the food.", freezeDrying: "Captures the peak essential oils of the fresh herbs." }
      ]
    }
  },
  { id: "dog-salmon", name: "Salmon & Sweet Potato", category: "Pet Food", packImage: packDogSalmon, ingredientImage: ingDogSalmon, accent: "#E89B8A", price: "₹649", blurb: "Omega-rich salmon with sweet potato — grain-free, freeze-dried." },
];

export const CATEGORIES: Category[] = [
  "Fruits",
  "Vegetables",
  "Gravies",
  "Spices",
  "Superfoods",
  "Pre-Cooked Meals",
];

