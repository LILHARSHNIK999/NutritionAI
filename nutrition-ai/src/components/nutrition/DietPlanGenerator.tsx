import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { getPersonalizedDietPlan } from '../../lib/gemini';
import { NutritionData } from './NutritionCalculator';

interface DietPlanGeneratorProps {
  userData: {
    nutritionData: NutritionData;
    preferences: string[];
    restrictions: string[];
    medicalConditions: string[];
  };
  onPlanGenerated?: (plan: string) => void;
}

const DietPlanGenerator: React.FC<DietPlanGeneratorProps> = ({ 
  userData, 
  onPlanGenerated 
}) => {
  const [loading, setLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState<string | null>(null);
  const [planType, setPlanType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const generatePlan = async () => {
    setLoading(true);
    try {
      const { nutritionData, preferences, restrictions, medicalConditions } = userData;
      
      const plan = await getPersonalizedDietPlan({
        age: nutritionData.age,
        gender: nutritionData.gender,
        weight: nutritionData.weight,
        height: nutritionData.height,
        activityLevel: nutritionData.activityLevel,
        goal: nutritionData.goal,
        medicalConditions,
        preferences,
        restrictions
      });
      
      setDietPlan(plan);
      if (onPlanGenerated) {
        onPlanGenerated(plan);
      }
    } catch (error) {
      console.error('Error generating diet plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Personalized Diet Plan</CardTitle>
        <CardDescription>
          Generate a customized diet plan based on your nutritional needs and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Plan Type</h3>
            <div className="flex space-x-2">
              <Button
                variant={planType === 'daily' ? 'default' : 'outline'}
                onClick={() => setPlanType('daily')}
              >
                Daily
              </Button>
              <Button
                variant={planType === 'weekly' ? 'default' : 'outline'}
                onClick={() => setPlanType('weekly')}
              >
                Weekly
              </Button>
              <Button
                variant={planType === 'monthly' ? 'default' : 'outline'}
                onClick={() => setPlanType('monthly')}
              >
                Monthly
              </Button>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium mb-2">Your Profile Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Calorie Target:</span>{' '}
                <span className="font-medium">{userData.nutritionData.calorieTarget} kcal</span>
              </div>
              <div>
                <span className="text-muted-foreground">Protein:</span>{' '}
                <span className="font-medium">{userData.nutritionData.macros.protein}g</span>
              </div>
              <div>
                <span className="text-muted-foreground">Carbs:</span>{' '}
                <span className="font-medium">{userData.nutritionData.macros.carbs}g</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fat:</span>{' '}
                <span className="font-medium">{userData.nutritionData.macros.fat}g</span>
              </div>
            </div>

            {userData.preferences.length > 0 && (
              <div className="mt-3">
                <span className="text-xs text-muted-foreground">Preferences:</span>{' '}
                <span className="text-xs">{userData.preferences.join(', ')}</span>
              </div>
            )}

            {userData.restrictions.length > 0 && (
              <div className="mt-1">
                <span className="text-xs text-muted-foreground">Restrictions:</span>{' '}
                <span className="text-xs">{userData.restrictions.join(', ')}</span>
              </div>
            )}

            {userData.medicalConditions.length > 0 && (
              <div className="mt-1">
                <span className="text-xs text-muted-foreground">Medical Conditions:</span>{' '}
                <span className="text-xs">{userData.medicalConditions.join(', ')}</span>
              </div>
            )}
          </div>

          {dietPlan && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Your {planType.charAt(0).toUpperCase() + planType.slice(1)} Diet Plan</h3>
              <div className="p-4 bg-card border rounded-lg whitespace-pre-line">
                {dietPlan}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={generatePlan} 
          disabled={loading} 
          className="w-full"
        >
          {loading ? 'Generating...' : `Generate ${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DietPlanGenerator;