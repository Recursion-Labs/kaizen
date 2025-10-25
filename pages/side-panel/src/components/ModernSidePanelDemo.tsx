import { useState, useEffect } from "react";
import { cn } from "@extension/ui";
import { 
  Sparkles, 
  Zap, 
  Heart, 
  Star,
  ArrowRight,
  CheckCircle,
  Play
} from "lucide-react";
import type React from "react";

interface ModernSidePanelDemoProps {
  theme: "light" | "dark";
}

const ModernSidePanelDemo: React.FC<ModernSidePanelDemoProps> = ({ theme }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const features = [
    {
      title: "Smooth Animations",
      description: "Elegant transitions and hover effects",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Interactive Navigation",
      description: "Glowing icons with scale effects",
      icon: Zap,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Modern Design",
      description: "Clean, rounded, and minimal interface",
      icon: Heart,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Responsive Layout",
      description: "Adapts beautifully to any screen size",
      icon: Star,
      color: "from-orange-500 to-red-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className={cn(
      "p-6 space-y-6",
      theme === "light" ? "bg-kaizen-light-bg" : "bg-kaizen-dark-bg"
    )}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className={cn(
          "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center",
          "bg-gradient-to-r from-kaizen-accent to-kaizen-primary",
          "animate-pulse"
        )}>
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className={cn(
          "text-2xl font-bold",
          theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
        )}>
          Modern Side Panel
        </h2>
        <p className={cn(
          "text-sm max-w-md mx-auto",
          theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
        )}>
          Experience the future of Chrome extension interfaces with smooth animations and elegant design
        </p>
      </div>

      {/* Feature Showcase */}
      <div className="space-y-4">
        <h3 className={cn(
          "text-lg font-semibold text-center",
          theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
        )}>
          Key Features
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = index === currentFeature;
            
            return (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-300",
                  "hover:scale-105 cursor-pointer",
                  isActive
                    ? "border-kaizen-accent bg-gradient-to-r from-kaizen-accent/10 to-kaizen-primary/10"
                    : theme === "light"
                      ? "border-kaizen-border bg-kaizen-surface hover:border-kaizen-accent"
                      : "border-kaizen-dark-border bg-kaizen-dark-surface hover:border-kaizen-accent"
                )}
                onClick={() => setCurrentFeature(index)}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center mb-2",
                  `bg-gradient-to-r ${feature.color}`
                )}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h4 className={cn(
                  "text-sm font-medium mb-1",
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
                )}>
                  {feature.title}
                </h4>
                <p className={cn(
                  "text-xs",
                  theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
                )}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animation Demo */}
      <div className="space-y-4">
        <h3 className={cn(
          "text-lg font-semibold text-center",
          theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
        )}>
          Animation Demo
        </h3>
        
        <div className="flex justify-center space-x-4">
          <button className={cn(
            "px-6 py-3 rounded-xl font-medium flex items-center space-x-2",
            "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white",
            "hover:shadow-lg transition-all duration-200 hover:scale-105"
          )}>
            <Play className="w-4 h-4" />
            <span>Try Animations</span>
          </button>
          
          <button className={cn(
            "px-6 py-3 rounded-xl font-medium flex items-center space-x-2",
            "border-2 border-kaizen-accent text-kaizen-accent",
            "hover:bg-kaizen-accent hover:text-white transition-all duration-200 hover:scale-105"
          )}>
            <CheckCircle className="w-4 h-4" />
            <span>Features</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className={cn(
            "text-2xl font-bold",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
          )}>
            4
          </div>
          <div className={cn(
            "text-xs",
            theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
          )}>
            Sections
          </div>
        </div>
        <div className="text-center">
          <div className={cn(
            "text-2xl font-bold",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
          )}>
            20+
          </div>
          <div className={cn(
            "text-xs",
            theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
          )}>
            Animations
          </div>
        </div>
        <div className="text-center">
          <div className={cn(
            "text-2xl font-bold",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
          )}>
            100%
          </div>
          <div className={cn(
            "text-xs",
            theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
          )}>
            Responsive
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className={cn(
        "p-4 rounded-xl text-center",
        "bg-gradient-to-r from-kaizen-accent/10 to-kaizen-primary/10",
        "border border-kaizen-accent/20"
      )}>
        <p className={cn(
          "text-sm mb-3",
          theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
        )}>
          Ready to experience the modern interface?
        </p>
        <button className={cn(
          "inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium",
          "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white",
          "hover:shadow-lg transition-all duration-200 hover:scale-105"
        )}>
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ModernSidePanelDemo;
