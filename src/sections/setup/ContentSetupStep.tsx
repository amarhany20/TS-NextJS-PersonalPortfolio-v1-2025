import React from 'react';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

interface ContentSetupStepProps {
  data?: {
    includeSampleData: boolean;
  };
  onUpdate: (data: { includeSampleData: boolean }) => void;
  onComplete: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
}

export default function ContentSetupStep({
  data,
  onUpdate,
  onComplete,
  onPrev,
  isSubmitting
}: ContentSetupStepProps) {
  const [includeSampleData, setIncludeSampleData] = React.useState(data?.includeSampleData ?? true);

  const handleComplete = () => {
    onUpdate({ includeSampleData });
    onComplete();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Content Setup</h2>
          <p className="text-muted mt-2">
            Choose how you&apos;d like to start your portfolio.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                includeSampleData
                  ? 'border-accent-primary bg-accent-primary/5'
                  : 'border-border hover:border-accent-primary/50'
              }`}
              onClick={() => setIncludeSampleData(true)}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  checked={includeSampleData}
                  onChange={() => setIncludeSampleData(true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">Start with Sample Content</h3>
                  <p className="text-sm text-muted mt-1">
                    Includes demo projects, experience entries, education records, skills, certificates,
                    and testimonials. Perfect for getting started quickly and seeing how everything works.
                  </p>
                  <div className="mt-3 space-y-1 text-xs text-muted">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>2 portfolio projects</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>2 work experience entries</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>1 education record</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Skills across multiple categories</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                !includeSampleData
                  ? 'border-accent-primary bg-accent-primary/5'
                  : 'border-border hover:border-accent-primary/50'
              }`}
              onClick={() => setIncludeSampleData(false)}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  checked={!includeSampleData}
                  onChange={() => setIncludeSampleData(false)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">Start Fresh</h3>
                  <p className="text-sm text-muted mt-1">
                    Begin with an empty portfolio. You&apos;ll add your own content through the admin dashboard.
                    Great if you prefer to build everything from scratch.
                  </p>
                  <div className="mt-3 text-xs text-muted">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Clean slate - add your own content</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">What happens next?</h4>
            <ul className="text-sm text-muted space-y-1">
              <li>• Database tables will be created and configured</li>
              <li>• Your admin account will be set up</li>
              <li>• Site settings and theme will be applied</li>
              <li>• {includeSampleData ? 'Sample content will be added' : 'Portfolio will be ready for your content'}</li>
              <li>• You&apos;ll be redirected to the admin dashboard</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <button
            onClick={onPrev}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <button
            onClick={handleComplete}
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Complete Setup
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}