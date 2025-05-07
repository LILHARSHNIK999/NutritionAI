// Nutrition calculator utilities

// Calculate BMI (Body Mass Index)
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
}

// Interpret BMI category
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi < 25) return 'Normal weight';
  if (bmi >= 25 && bmi < 30) return 'Overweight';
  return 'Obese';
}

// Calculate IBW (Ideal Body Weight) using Devine formula
export function calculateIBW(heightCm: number, gender: string): number {
  const heightInches = heightCm / 2.54;
  
  if (gender.toLowerCase() === 'male') {
    return parseFloat((50 + (2.3 * (heightInches - 60))).toFixed(1));
  } else {
    return parseFloat((45.5 + (2.3 * (heightInches - 60))).toFixed(1));
  }
}

// Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
export function calculateBMR(weightKg: number, heightCm: number, ageYears: number, gender: string): number {
  if (gender.toLowerCase() === 'male') {
    return parseFloat((10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5).toFixed(0));
  } else {
    return parseFloat((10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161).toFixed(0));
  }
}

// Calculate TDEE (Total Daily Energy Expenditure)
export function calculateTDEE(bmr: number, activityLevel: string): number {
  const activityMultipliers: { [key: string]: number } = {
    'sedentary': 1.2, // Little or no exercise
    'light': 1.375, // Light exercise 1-3 days/week
    'moderate': 1.55, // Moderate exercise 3-5 days/week
    'active': 1.725, // Hard exercise 6-7 days/week
    'very_active': 1.9 // Very hard exercise & physical job or 2x training
  };
  
  return parseFloat((bmr * (activityMultipliers[activityLevel] || 1.2)).toFixed(0));
}

// Calculate calorie target based on goal
export function calculateCalorieTarget(tdee: number, goal: string): number {
  switch (goal.toLowerCase()) {
    case 'weight_loss':
      return parseFloat((tdee * 0.8).toFixed(0)); // 20% deficit
    case 'moderate_weight_loss':
      return parseFloat((tdee * 0.85).toFixed(0)); // 15% deficit
    case 'mild_weight_loss':
      return parseFloat((tdee * 0.9).toFixed(0)); // 10% deficit
    case 'maintenance':
      return tdee;
    case 'mild_weight_gain':
      return parseFloat((tdee * 1.1).toFixed(0)); // 10% surplus
    case 'moderate_weight_gain':
      return parseFloat((tdee * 1.15).toFixed(0)); // 15% surplus
    case 'weight_gain':
      return parseFloat((tdee * 1.2).toFixed(0)); // 20% surplus
    default:
      return tdee;
  }
}

// Calculate macronutrient distribution
export function calculateMacros(
  calorieTarget: number, 
  goal: string, 
  medicalConditions: string[] = []
): { protein: number; carbs: number; fat: number } {
  let proteinPct = 0.3; // 30% protein
  let fatPct = 0.3; // 30% fat
  let carbsPct = 0.4; // 40% carbs
  
  // Adjust macros based on goal
  if (goal === 'weight_loss') {
    proteinPct = 0.35;
    fatPct = 0.35;
    carbsPct = 0.3;
  } else if (goal === 'weight_gain' || goal === 'muscle_gain') {
    proteinPct = 0.3;
    fatPct = 0.25;
    carbsPct = 0.45;
  }
  
  // Adjust for medical conditions
  if (medicalConditions.includes('diabetes')) {
    carbsPct = 0.3;
    proteinPct = 0.35;
    fatPct = 0.35;
  }
  
  // Calculate grams of each macronutrient
  const proteinGrams = parseFloat(((calorieTarget * proteinPct) / 4).toFixed(0));
  const carbsGrams = parseFloat(((calorieTarget * carbsPct) / 4).toFixed(0));
  const fatGrams = parseFloat(((calorieTarget * fatPct) / 9).toFixed(0));
  
  return {
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams
  };
}

// Calculate water intake recommendation (in liters)
export function calculateWaterIntake(weightKg: number, activityLevel: string): number {
  let waterMultiplier = 0.033; // 33ml per kg of body weight
  
  if (activityLevel === 'active' || activityLevel === 'very_active') {
    waterMultiplier = 0.04; // 40ml per kg for active individuals
  }
  
  return parseFloat((weightKg * waterMultiplier).toFixed(1));
}

export default {
  calculateBMI,
  getBMICategory,
  calculateIBW,
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateMacros,
  calculateWaterIntake
};