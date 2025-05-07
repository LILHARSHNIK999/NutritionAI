import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions?: string;
  image?: string;
  tags: string[];
}

export interface MealPlanCardProps {
  meal: Meal;
  onViewDetails?: (meal: Meal) => void;
  onReplace?: (meal: Meal) => void;
  onSave?: (meal: Meal) => void;
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({
  meal,
  onViewDetails,
  onReplace,
  onSave,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{meal.name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {meal.description}
            </CardDescription>
          </div>
          {meal.image && (
            <div className="w-16 h-16 rounded-md overflow-hidden">
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">{meal.calories} kcal</span>
          <div className="flex space-x-3">
            <span>P: {meal.protein}g</span>
            <span>C: {meal.carbs}g</span>
            <span>F: {meal.fat}g</span>
          </div>
        </div>
        
        <div className="mt-2">
          <h4 className="text-xs font-medium text-muted-foreground mb-1">INGREDIENTS</h4>
          <ul className="text-sm space-y-1">
            {meal.ingredients.slice(0, 3).map((ingredient, index) => (
              <li key={index} className="line-clamp-1">• {ingredient}</li>
            ))}
            {meal.ingredients.length > 3 && (
              <li className="text-xs text-muted-foreground">
                +{meal.ingredients.length - 3} more ingredients
              </li>
            )}
          </ul>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {meal.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails && onViewDetails(meal)}
        >
          Details
        </Button>
        <div className="flex space-x-2">
          {onReplace && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReplace(meal)}
            >
              Replace
            </Button>
          )}
          {onSave && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onSave(meal)}
            >
              Save
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MealPlanCard;