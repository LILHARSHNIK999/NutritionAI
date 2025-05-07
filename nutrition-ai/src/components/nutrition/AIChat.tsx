import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { getNutritionAdvice } from '../../lib/gemini';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatProps {
  userData?: {
    name?: string;
    nutritionData?: any;
    preferences?: string[];
    restrictions?: string[];
    medicalConditions?: string[];
  };
}

const AIChat: React.FC<AIChatProps> = ({ userData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello${userData?.name ? ` ${userData.name}` : ''}! I'm your nutrition AI assistant. How can I help you with your diet and nutrition goals today?`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Create a context-aware prompt that includes user data
      let contextPrompt = `You are a nutrition AI assistant helping a user with their diet and nutrition goals. `;
      
      if (userData) {
        contextPrompt += `Here's some information about the user:\n`;
        
        if (userData.nutritionData) {
          const { nutritionData } = userData;
          contextPrompt += `- Age: ${nutritionData.age}\n`;
          contextPrompt += `- Gender: ${nutritionData.gender}\n`;
          contextPrompt += `- Height: ${nutritionData.height} cm\n`;
          contextPrompt += `- Weight: ${nutritionData.weight} kg\n`;
          contextPrompt += `- BMI: ${nutritionData.bmi} (${nutritionData.bmiCategory})\n`;
          contextPrompt += `- Daily calorie target: ${nutritionData.calorieTarget} kcal\n`;
          contextPrompt += `- Macros: ${nutritionData.macros.protein}g protein, ${nutritionData.macros.carbs}g carbs, ${nutritionData.macros.fat}g fat\n`;
        }
        
        if (userData.preferences && userData.preferences.length > 0) {
          contextPrompt += `- Dietary preferences: ${userData.preferences.join(', ')}\n`;
        }
        
        if (userData.restrictions && userData.restrictions.length > 0) {
          contextPrompt += `- Dietary restrictions: ${userData.restrictions.join(', ')}\n`;
        }
        
        if (userData.medicalConditions && userData.medicalConditions.length > 0) {
          contextPrompt += `- Medical conditions: ${userData.medicalConditions.join(', ')}\n`;
        }
      }
      
      contextPrompt += `\nThe user's question is: "${inputValue}"\n\nProvide a helpful, friendly, and informative response about nutrition, diet planning, or healthy eating. Include specific advice when possible, and suggest futuristic upgrades or integrations that could help them achieve their goals.`;

      const aiResponse = await getNutritionAdvice(contextPrompt);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while processing your request. Please try again later.',
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Nutrition AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="whitespace-pre-line">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.sender === 'user'
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Ask about nutrition, meal ideas, or diet tips..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIChat;