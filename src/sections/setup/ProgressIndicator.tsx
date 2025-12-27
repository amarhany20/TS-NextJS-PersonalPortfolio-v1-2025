import { Check } from 'lucide-react';
import type { SetupStep } from './SetupWizard';

interface Step {
  id: SetupStep;
  title: string;
  description: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: SetupStep;
}

export default function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCompleted
                      ? 'bg-success text-white'
                      : isCurrent
                      ? 'bg-accent-primary text-white'
                      : 'bg-muted text-muted'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${
                    isCurrent ? 'text-foreground' : 'text-muted'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-muted mt-1 max-w-24">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? 'bg-success' : 'bg-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}