import React, { useState } from 'react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: 'Welcome to Kaizen',
    description: 'Your AI mirror for digital balance. Kaizen helps you become aware of your browsing patterns—without judgment or control.',
    icon: '🧘',
  },
  {
    title: 'Awareness, Not Restriction',
    description: 'Kaizen quietly observes your browsing behavior and gently nudges you when patterns emerge. Think of it as a mindful companion, not a blocker.',
    icon: '💭',
  },
  {
    title: 'Personalized Nudges',
    description: 'Get gentle reminders when you drift into doomscrolling, binge-watching, or shopping loops. Customize the tone, timing, and categories that matter to you.',
    icon: '🔔',
  },
  {
    title: 'Pattern Recognition',
    description: 'Kaizen learns your habits over time and provides insights about when and how you browse. See connections you might otherwise miss.',
    icon: '🧠',
  },
  {
    title: 'Privacy First',
    description: 'All your data stays on your device. Kaizen processes everything locally—your browsing history never leaves your browser.',
    icon: '🔒',
  },
];

interface OnboardingPageProps {
  onComplete: () => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTone, setSelectedTone] = useState<'calm' | 'funny' | 'serious' | 'reflective'>('calm');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'doomscrolling',
    'binge-watching',
    'shopping-loops',
  ]);

  const isLastStep = currentStep === ONBOARDING_STEPS.length;
  const step = ONBOARDING_STEPS[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // Save preferences
    await chrome.storage.local.set({
      nudgeSettings: {
        enabled: true,
        tone: selectedTone,
        timing: 'delayed',
        categories: selectedCategories,
        quietHoursEnabled: true,
        quietHoursStart: 22,
        quietHoursEnd: 7,
        maxPerHour: 3,
      },
      kaizenOnboarded: true,
    });

    onComplete();
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / (ONBOARDING_STEPS.length + 1)) * 100}%` }}
          />
        </div>

        <div className="p-8 md:p-12">
          {!isLastStep ? (
            <>
              {/* Step Content */}
              <div className="text-center mb-8">
                <div className="text-7xl mb-6">{step.icon}</div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Preferences Setup */}
              <div className="text-center mb-8">
                <div className="text-7xl mb-6">⚙️</div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Customize Your Experience
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Choose how Kaizen should communicate with you
                </p>
              </div>

              {/* Tone Selection */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Nudge Tone
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'calm', label: 'Calm', emoji: '🌿' },
                    { value: 'funny', label: 'Funny', emoji: '😄' },
                    { value: 'serious', label: 'Serious', emoji: '📊' },
                    { value: 'reflective', label: 'Reflective', emoji: '🤔' },
                  ].map((tone) => (
                    <button
                      key={tone.value}
                      onClick={() => setSelectedTone(tone.value as any)}
                      className={`
                        p-4 rounded-lg border-2 transition-all text-left
                        ${selectedTone === tone.value
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{tone.emoji}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {tone.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Selection */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  What would you like to track?
                </h3>
                <div className="space-y-2">
                  {[
                    { id: 'doomscrolling', label: 'Doomscrolling', icon: '🧘' },
                    { id: 'binge-watching', label: 'Binge Watching', icon: '👀' },
                    { id: 'shopping-loops', label: 'Shopping Loops', icon: '🛒' },
                    { id: 'tab-hoarding', label: 'Tab Hoarding', icon: '📑' },
                    { id: 'distracted-browsing', label: 'Distracted Browsing', icon: '🎯' },
                  ].map((category) => (
                    <label
                      key={category.id}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                        ${selectedCategories.includes(category.id)
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {category.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`
                px-6 py-2 rounded-lg font-medium transition-colors
                ${currentStep === 0
                  ? 'invisible'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              ← Back
            </button>

            <div className="flex gap-2">
              {ONBOARDING_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`
                    h-2 w-2 rounded-full transition-colors
                    ${index === currentStep
                      ? 'bg-indigo-600 w-8'
                      : index < currentStep
                      ? 'bg-indigo-300'
                      : 'bg-gray-300 dark:bg-gray-600'
                    }
                  `}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
            >
              {isLastStep ? 'Get Started' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
