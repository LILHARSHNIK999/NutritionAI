'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../lib/auth-context';
import NutritionCalculator, { NutritionData } from '../../components/nutrition/NutritionCalculator';

export default function Onboarding() {
  const { user, loading, updateUserProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [customPreference, setCustomPreference] = useState('');
  const [customRestriction, setCustomRestriction] = useState('');
  const [customCondition, setCustomCondition] = useState('');
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleAddPreference = () => {
    if (customPreference.trim() && !preferences.includes(customPreference.trim())) {
      setPreferences([...preferences, customPreference.trim()]);
      setCustomPreference('');
    }
  };

  const handleAddRestriction = () => {
    if (customRestriction.trim() && !restrictions.includes(customRestriction.trim())) {
      setRestrictions([...restrictions, customRestriction.trim()]);
      setCustomRestriction('');
    }
  };

  const handleAddCondition = () => {
    if (customCondition.trim() && !medicalConditions.includes(customCondition.trim())) {
      setMedicalConditions([...medicalConditions, customCondition.trim()]);
      setCustomCondition('');
    }
  };

  const handleRemovePreference = (pref: string) => {
    setPreferences(preferences.filter(p => p !== pref));
  };

  const handleRemoveRestriction = (rest: string) => {
    setRestrictions(restrictions.filter(r => r !== rest));
  };

  const handleRemoveCondition = (cond: string) => {
    setMedicalConditions(medicalConditions.filter(c => c !== cond));
  };

  const handleNutritionDataSave = (data: NutritionData) => {
    setNutritionData(data);
  };

  const handleComplete = async () => {
    if (!user || !nutritionData) return;
    
    try {
      await updateUserProfile({
        nutritionData,
        preferences,
        restrictions,
        medicalConditions,
        profileComplete: true,
        updatedAt: new Date().toISOString()
      });
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Welcome to NutritionAI</h1>
            <p className="text-muted-foreground mt-2">
              Let's set up your profile to create personalized nutrition plans
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 ${
                    s < step
                      ? 'bg-primary'
                      : s === step
                      ? 'bg-primary/60'
                      : 'bg-muted-foreground/20'
                  }`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm font-medium">Body Metrics</span>
              <span className="text-sm font-medium">Preferences</span>
              <span className="text-sm font-medium">Complete</span>
            </div>
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Body Metrics & Nutrition Goals</CardTitle>
                <CardDescription>
                  Let's calculate your nutritional needs based on your body metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NutritionCalculator onSave={handleNutritionDataSave} />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div></div>
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!nutritionData}
                >
                  Next: Preferences
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Dietary Preferences & Restrictions</CardTitle>
                <CardDescription>
                  Tell us about your food preferences, allergies, and medical conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Dietary Preferences</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select or add your dietary preferences (e.g., Mediterranean, High-protein, Vegetarian)
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Mediterranean', 'High-protein', 'Low-carb', 'Vegetarian', 'Vegan', 'Paleo', 'Keto'].map((pref) => (
                      <button
                        key={pref}
                        onClick={() => {
                          if (!preferences.includes(pref)) {
                            setPreferences([...preferences, pref]);
                          } else {
                            handleRemovePreference(pref);
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          preferences.includes(pref)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted-foreground/10 hover:bg-muted-foreground/20'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add custom preference"
                      value={customPreference}
                      onChange={(e) => setCustomPreference(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddPreference()}
                    />
                    <Button variant="outline" onClick={handleAddPreference}>
                      Add
                    </Button>
                  </div>
                  
                  {preferences.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Your Preferences:</h4>
                      <div className="flex flex-wrap gap-2">
                        {preferences.map((pref) => (
                          <div
                            key={pref}
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            {pref}
                            <button
                              onClick={() => handleRemovePreference(pref)}
                              className="ml-2 text-primary hover:text-primary/70"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Dietary Restrictions & Allergies</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select or add any food allergies or ingredients you want to avoid
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Gluten', 'Dairy', 'Nuts', 'Shellfish', 'Eggs', 'Soy', 'Fish'].map((rest) => (
                      <button
                        key={rest}
                        onClick={() => {
                          if (!restrictions.includes(rest)) {
                            setRestrictions([...restrictions, rest]);
                          } else {
                            handleRemoveRestriction(rest);
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          restrictions.includes(rest)
                            ? 'bg-destructive text-destructive-foreground'
                            : 'bg-muted-foreground/10 hover:bg-muted-foreground/20'
                        }`}
                      >
                        {rest}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add custom restriction or allergy"
                      value={customRestriction}
                      onChange={(e) => setCustomRestriction(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddRestriction()}
                    />
                    <Button variant="outline" onClick={handleAddRestriction}>
                      Add
                    </Button>
                  </div>
                  
                  {restrictions.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Your Restrictions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {restrictions.map((rest) => (
                          <div
                            key={rest}
                            className="bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            {rest}
                            <button
                              onClick={() => handleRemoveRestriction(rest)}
                              className="ml-2 text-destructive hover:text-destructive/70"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Medical Conditions</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select or add any medical conditions that may affect your nutrition needs
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Diabetes', 'Hypertension', 'IBS', 'Celiac Disease', 'GERD', 'Heart Disease'].map((cond) => (
                      <button
                        key={cond}
                        onClick={() => {
                          if (!medicalConditions.includes(cond)) {
                            setMedicalConditions([...medicalConditions, cond]);
                          } else {
                            handleRemoveCondition(cond);
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          medicalConditions.includes(cond)
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-muted-foreground/10 hover:bg-muted-foreground/20'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add custom medical condition"
                      value={customCondition}
                      onChange={(e) => setCustomCondition(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCondition()}
                    />
                    <Button variant="outline" onClick={handleAddCondition}>
                      Add
                    </Button>
                  </div>
                  
                  {medicalConditions.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Your Medical Conditions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {medicalConditions.map((cond) => (
                          <div
                            key={cond}
                            className="bg-secondary/10 text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            {cond}
                            <button
                              onClick={() => handleRemoveCondition(cond)}
                              className="ml-2 text-secondary-foreground hover:text-secondary-foreground/70"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Next: Complete
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
                <CardDescription>
                  Review your information before completing the setup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {nutritionData && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Nutrition Information</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Height</p>
                          <p className="font-medium">{nutritionData.height} cm</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Weight</p>
                          <p className="font-medium">{nutritionData.weight} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">BMI</p>
                          <p className="font-medium">{nutritionData.bmi} ({nutritionData.bmiCategory})</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Ideal Body Weight</p>
                          <p className="font-medium">{nutritionData.ibw} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Daily Calorie Target</p>
                          <p className="font-medium">{nutritionData.calorieTarget} kcal</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Goal</p>
                          <p className="font-medium">{nutritionData.goal.replace('_', ' ')}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">Macronutrient Breakdown</p>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-md text-center">
                            <p className="text-xs">Protein</p>
                            <p className="text-lg font-bold">{nutritionData.macros.protein}g</p>
                          </div>
                          <div className="bg-green-100 dark:bg-green-900 p-2 rounded-md text-center">
                            <p className="text-xs">Carbs</p>
                            <p className="text-lg font-bold">{nutritionData.macros.carbs}g</p>
                          </div>
                          <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-md text-center">
                            <p className="text-xs">Fat</p>
                            <p className="text-lg font-bold">{nutritionData.macros.fat}g</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Preferences</h3>
                    {preferences.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {preferences.map((pref) => (
                          <div
                            key={pref}
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                          >
                            {pref}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No preferences selected</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Restrictions</h3>
                    {restrictions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {restrictions.map((rest) => (
                          <div
                            key={rest}
                            className="bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm"
                          >
                            {rest}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No restrictions selected</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Medical Conditions</h3>
                    {medicalConditions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {medicalConditions.map((cond) => (
                          <div
                            key={cond}
                            className="bg-secondary/10 text-secondary-foreground px-3 py-1 rounded-full text-sm"
                          >
                            {cond}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No medical conditions selected</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={handleComplete}>
                  Complete Setup
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}