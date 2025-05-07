import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">NutritionAI</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Your Personalized <span className="text-primary">Nutrition</span> Journey Starts Here
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Generate customized diet plans based on your body metrics, preferences, and health goals with our advanced AI-powered platform.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/features">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 mt-12 md:mt-0">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-lg blur opacity-25"></div>
                  <div className="relative bg-card border rounded-lg shadow-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                      alt="Healthy meal planning"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our platform combines cutting-edge AI with nutritional science to deliver a personalized experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Personalized Diet Plans',
                  description: 'Get customized daily, weekly, or monthly meal plans based on your unique nutritional needs.',
                  icon: '🍽️',
                },
                {
                  title: 'AI Nutrition Assistant',
                  description: 'Chat with our Gemini-powered AI for real-time nutrition advice and meal suggestions.',
                  icon: '🤖',
                },
                {
                  title: 'Body Metrics Analysis',
                  description: 'Calculate your IBW, BMI, and optimal caloric intake based on your goals.',
                  icon: '📊',
                },
                {
                  title: 'Dietary Restrictions',
                  description: 'Accommodate any allergies or dietary preferences like vegan, keto, or gluten-free.',
                  icon: '🥗',
                },
                {
                  title: 'Progress Tracking',
                  description: 'Monitor your journey with interactive calendars and visual progress indicators.',
                  icon: '📈',
                },
                {
                  title: 'Smart Grocery Lists',
                  description: 'Generate shopping lists automatically based on your personalized meal plans.',
                  icon: '🛒',
                },
              ].map((feature, index) => (
                <div key={index} className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Join thousands of satisfied users who have transformed their nutrition habits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "The personalized meal plans have completely changed how I approach nutrition. I've lost 15 pounds in 3 months!",
                  author: "Sarah J.",
                  role: "Fitness Enthusiast",
                },
                {
                  quote: "As someone with multiple food allergies, finding a platform that can accommodate all my restrictions has been life-changing.",
                  author: "Michael T.",
                  role: "Software Developer",
                },
                {
                  quote: "The AI assistant feels like having a nutritionist in my pocket. It's helped me make better food choices every day.",
                  author: "Emma R.",
                  role: "Busy Professional",
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-card border rounded-lg p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex-grow">
                      <p className="italic mb-4">"{testimonial.quote}"</p>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Nutrition?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Join NutritionAI today and get personalized diet plans tailored to your unique needs and goals.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="px-8">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">NutritionAI</h3>
              <p className="text-muted-foreground">
                Personalized nutrition plans powered by artificial intelligence.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/guides" className="text-muted-foreground hover:text-foreground transition-colors">Nutrition Guides</Link></li>
                <li><Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} NutritionAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}