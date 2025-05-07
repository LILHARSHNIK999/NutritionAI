import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  calculateBMI, 
  getBMICategory, 
  calculateIBW, 
  calculateBMR, 
  calculateTDEE, 
  calculateCalorieTarget,
  calculateMacros
} from '../../utils/nutrition-calculator';

interface NutritionCalculatorProps {
  onSave?: (data: NutritionData) => void;
  initialData?: Partial<NutritionData>;
}

export interface NutritionData {
  height: number;
  weight: number;
  age: number;
  gender: string;
  activityLevel: string;
  goal: string;
  bmi: number;
  bmiCategory: string;
  ibw: number;
  bmr: number;
  tdee: number;
  calorieTarget: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

const NutritionCalculator: React.FC<NutritionCalculatorProps> = ({ onSave, initialData = {} }) => {
  const [height, setHeight] = useState<number>(initialData.height || 0);
  const [weight, setWeight] = useState<number>(initialData.weight || 0);
  const [age, setAge] = useState<number>(initialData.age || 0);
  const [gender, setGender] = useState<string>(initialData.gender || 'male');
  const [activityLevel, setActivityLevel] = useState<string>(initialData.activityLevel || 'moderate');
  const [goal, setGoal] = useState<string>(initialData.goal || 'maintenance');
  const [results, setResults] = useState<Omit<NutritionData, 'height' | 'weight' | 'age' | 'gender' | 'activityLevel' | 'goal'> | null>(null);

  const handleCalculate = () => {
    if (!height || !weight || !age) {
      alert('Please fill in all required fields');
      return;
    }

    const bmi = calculateBMI(weight, height);
    const bmiCategory = getBMICategory(bmi);
    const ibw = calculateIBW(height, gender);
    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const calorieTarget = calculateCalorieTarget(tdee, goal);
    const macros = calculateMacros(calorieTarget, goal);

    const newResults = {
      bmi,
      bmiCategory,
      ibw,
      bmr,
      tdee,
      calorieTarget,
      macros
    };

    setResults(newResults);

    if (onSave) {
      onSave({
        height,
        weight,
        age,
        gender,
        activityLevel,
        goal,
        ...newResults
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Nutrition Calculator</CardTitle>
        <CardDescription>
          Calculate your BMI, Ideal Body Weight, and personalized nutrition plan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="height" className="text-sm font-medium">
              Height (cm)
            </label>
            <Input
              id="height"
              type="number"
              value={height || ''}
              onChange={(e) => setHeight(parseFloat(e.target.value))}
              placeholder="Enter your height in cm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="weight" className="text-sm font-medium">
              Weight (kg)
            </label>
            <Input
              id="weight"
              type="number"
              value={weight || ''}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              placeholder="Enter your weight in kg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="age" className="text-sm font-medium">
              Age (years)
            </label>
            <Input
              id="age"
              type="number"
              value={age || ''}
              onChange={(e) => setAge(parseInt(e.target.value))}
              placeholder="Enter your age"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="gender" className="text-sm font-medium">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="activityLevel" className="text-sm font-medium">
              Activity Level
            </label>
            <select
              id="activityLevel"
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light">Light (exercise 1-3 days/week)</option>
              <option value="moderate">Moderate (exercise 3-5 days/week)</option>
              <option value="active">Active (exercise 6-7 days/week)</option>
              <option value="very_active">Very Active (hard exercise & physical job)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="goal" className="text-sm font-medium">
              Goal
            </label>
            <select
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="weight_loss">Weight Loss</option>
              <option value="moderate_weight_loss">Moderate Weight Loss</option>
              <option value="mild_weight_loss">Mild Weight Loss</option>
              <option value="maintenance">Maintenance</option>
              <option value="mild_weight_gain">Mild Weight Gain</option>
              <option value="moderate_weight_gain">Moderate Weight Gain</option>
              <option value="weight_gain">Weight Gain</option>
            </select>
          </div>
        </div>

        {results && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Your Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">BMI</p>
                <p className="text-2xl font-bold">{results.bmi}</p>
                <p className="text-sm text-muted-foreground">{results.bmiCategory}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Ideal Body Weight</p>
                <p className="text-2xl font-bold">{results.ibw} kg</p>
              </div>
              <div>
                <p className="text-sm font-medium">Basal Metabolic Rate</p>
                <p className="text-2xl font-bold">{results.bmr} calories</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Daily Energy Expenditure</p>
                <p className="text-2xl font-bold">{results.tdee} calories</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium">Daily Calorie Target</p>
                <p className="text-2xl font-bold">{results.calorieTarget} calories</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium">Macronutrient Breakdown</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-md text-center">
                    <p className="text-sm">Protein</p>
                    <p className="text-xl font-bold">{results.macros.protein}g</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((results.macros.protein * 4) / results.calorieTarget * 100)}%
                    </p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-md text-center">
                    <p className="text-sm">Carbs</p>
                    <p className="text-xl font-bold">{results.macros.carbs}g</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((results.macros.carbs * 4) / results.calorieTarget * 100)}%
                    </p>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-md text-center">
                    <p className="text-sm">Fat</p>
                    <p className="text-xl font-bold">{results.macros.fat}g</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((results.macros.fat * 9) / results.calorieTarget * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleCalculate} className="w-full">
          Calculate
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NutritionCalculator;