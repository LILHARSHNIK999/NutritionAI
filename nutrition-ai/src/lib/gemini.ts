import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI("AIzaSyBFd-sRUyhnjfXSBqBaSNwiu0z3yMqWWTQ");

// Get the generative model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function getNutritionAdvice(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting nutrition advice:", error);
    return "Sorry, I couldn't generate nutrition advice at this time. Please try again later.";
  }
}

export async function getMealSuggestions(
  preferences: string[], 
  restrictions: string[], 
  calories: number,
  macros: { protein: number, carbs: number, fat: number }
): Promise<string> {
  const prompt = `
    Generate a meal suggestion based on the following criteria:
    - Dietary preferences: ${preferences.join(', ')}
    - Dietary restrictions: ${restrictions.join(', ')}
    - Target calories: ${calories} kcal
    - Target macros: ${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fat}g fat
    
    Please provide a detailed meal with ingredients, nutritional breakdown, and preparation instructions.
  `;
  
  return getNutritionAdvice(prompt);
}

export async function getPersonalizedDietPlan(
  userData: {
    age: number;
    gender: string;
    weight: number;
    height: number;
    activityLevel: string;
    goal: string;
    medicalConditions: string[];
    preferences: string[];
    restrictions: string[];
  }
): Promise<string> {
  const prompt = `
    Generate a personalized diet plan based on the following user data:
    - Age: ${userData.age}
    - Gender: ${userData.gender}
    - Weight: ${userData.weight} kg
    - Height: ${userData.height} cm
    - Activity level: ${userData.activityLevel}
    - Goal: ${userData.goal}
    - Medical conditions: ${userData.medicalConditions.join(', ') || 'None'}
    - Dietary preferences: ${userData.preferences.join(', ')}
    - Dietary restrictions: ${userData.restrictions.join(', ')}
    
    Please provide a comprehensive diet plan with:
    1. Daily caloric target
    2. Macronutrient breakdown
    3. Meal timing recommendations
    4. Sample meals for breakfast, lunch, dinner, and snacks
    5. Specific nutritional considerations based on their medical conditions
    6. Hydration recommendations
    7. Supplement suggestions if appropriate
  `;
  
  return getNutritionAdvice(prompt);
}

export default {
  getNutritionAdvice,
  getMealSuggestions,
  getPersonalizedDietPlan
};