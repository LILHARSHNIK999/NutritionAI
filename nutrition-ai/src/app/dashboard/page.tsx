'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../lib/auth-context';
import NutritionCalculator from '../../components/nutrition/NutritionCalculator';
import DietPlanGenerator from '../../components/nutrition/DietPlanGenerator';
import AIChat from '../../components/nutrition/AIChat';

export default function Dashboard() {
  const { user, loading, getUserProfile, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user, getUserProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
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
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">NutritionAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm hidden md:inline-block">
              Welcome, {user.displayName || 'User'}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {[
                    { id: 'overview', label: 'Overview', icon: '📊' },
                    { id: 'nutrition', label: 'Nutrition Calculator', icon: '🔢' },
                    { id: 'meal-plans', label: 'Meal Plans', icon: '🍽️' },
                    { id: 'ai-assistant', label: 'AI Assistant', icon: '🤖' },
                    { id: 'progress', label: 'Progress Tracking', icon: '📈' },
                    { id: 'settings', label: 'Settings', icon: '⚙️' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        activeTab === item.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setActiveTab(item.id)}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content Area */}
          <div className="flex-grow">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard Overview</CardTitle>
                    <CardDescription>
                      Your personalized nutrition journey at a glance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userProfile?.nutritionData ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-muted p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">DAILY CALORIES</h3>
                          <p className="text-3xl font-bold">{userProfile.nutritionData.calorieTarget}</p>
                          <p className="text-sm text-muted-foreground">kcal</p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">CURRENT WEIGHT</h3>
                          <p className="text-3xl font-bold">{userProfile.nutritionData.weight}</p>
                          <p className="text-sm text-muted-foreground">kg</p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">BMI</h3>
                          <p className="text-3xl font-bold">{userProfile.nutritionData.bmi}</p>
                          <p className="text-sm text-muted-foreground">{userProfile.nutritionData.bmiCategory}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          Complete your nutrition profile to see your personalized dashboard
                        </p>
                        <Button onClick={() => setActiveTab('nutrition')}>
                          Set Up Nutrition Profile
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {userProfile?.nutritionData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Today's Meal Plan</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {userProfile.mealPlan ? (
                            <>
                              {/* Meal plan content would go here */}
                              <p>Your meal plan is ready!</p>
                            </>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-muted-foreground mb-4">
                                Generate your personalized meal plan
                              </p>
                              <Button onClick={() => setActiveTab('meal-plans')}>
                                Create Meal Plan
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Nutrition Insights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium mb-2">Macronutrient Distribution</h3>
                            <div className="flex space-x-2">
                              <div className="h-4 bg-blue-500 rounded-full" style={{ width: `${(userProfile.nutritionData.macros.protein * 4 / userProfile.nutritionData.calorieTarget) * 100}%` }}></div>
                              <div className="h-4 bg-green-500 rounded-full" style={{ width: `${(userProfile.nutritionData.macros.carbs * 4 / userProfile.nutritionData.calorieTarget) * 100}%` }}></div>
                              <div className="h-4 bg-yellow-500 rounded-full" style={{ width: `${(userProfile.nutritionData.macros.fat * 9 / userProfile.nutritionData.calorieTarget) * 100}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs mt-1">
                              <span>Protein: {userProfile.nutritionData.macros.protein}g</span>
                              <span>Carbs: {userProfile.nutritionData.macros.carbs}g</span>
                              <span>Fat: {userProfile.nutritionData.macros.fat}g</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'nutrition' && (
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Calculator</CardTitle>
                  <CardDescription>
                    Calculate your nutritional needs based on your body metrics and goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NutritionCalculator 
                    initialData={userProfile?.nutritionData}
                    onSave={(data) => {
                      // This would update the user's profile in Firestore
                      console.log('Nutrition data saved:', data);
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {activeTab === 'meal-plans' && (
              <Card>
                <CardHeader>
                  <CardTitle>Meal Plan Generator</CardTitle>
                  <CardDescription>
                    Create personalized meal plans based on your nutritional needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userProfile?.nutritionData ? (
                    <DietPlanGenerator
                      userData={{
                        nutritionData: userProfile.nutritionData,
                        preferences: userProfile.preferences || [],
                        restrictions: userProfile.restrictions || [],
                        medicalConditions: userProfile.medicalConditions || [],
                      }}
                      onPlanGenerated={(plan) => {
                        console.log('Diet plan generated:', plan);
                      }}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        You need to complete your nutrition profile before generating meal plans
                      </p>
                      <Button onClick={() => setActiveTab('nutrition')}>
                        Set Up Nutrition Profile
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'ai-assistant' && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Nutrition Assistant</CardTitle>
                  <CardDescription>
                    Chat with our AI assistant for personalized nutrition advice
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AIChat
                    userData={{
                      name: user.displayName,
                      nutritionData: userProfile?.nutritionData,
                      preferences: userProfile?.preferences || [],
                      restrictions: userProfile?.restrictions || [],
                      medicalConditions: userProfile?.medicalConditions || [],
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {activeTab === 'progress' && (
              <Card>
                <CardHeader>
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription>
                    Track your nutrition and health progress over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      Progress tracking feature coming soon!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      Settings feature coming soon!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}