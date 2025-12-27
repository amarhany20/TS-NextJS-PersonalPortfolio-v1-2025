import { ArrowRight } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to Your Portfolio
          </h1>
          <p className="text-lg text-muted">
            Let&apos;s get your personal portfolio website up and running in just a few minutes.
          </p>
        </div>

        <div className="space-y-4 text-left max-w-md mx-auto">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-accent-primary rounded-full flex items-center justify-center text-white text-sm font-medium mt-0.5">
              1
            </div>
            <div>
              <h3 className="font-medium text-foreground">Database Setup</h3>
              <p className="text-sm text-muted">Configure your database (SQLite recommended for beginners)</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-accent-primary rounded-full flex items-center justify-center text-white text-sm font-medium mt-0.5">
              2
            </div>
            <div>
              <h3 className="font-medium text-foreground">Admin Account</h3>
              <p className="text-sm text-muted">Create your administrator account</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-accent-primary rounded-full flex items-center justify-center text-white text-sm font-medium mt-0.5">
              3
            </div>
            <div>
              <h3 className="font-medium text-foreground">Site Customization</h3>
              <p className="text-sm text-muted">Choose your theme and basic site settings</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-accent-primary rounded-full flex items-center justify-center text-white text-sm font-medium mt-0.5">
              4
            </div>
            <div>
              <h3 className="font-medium text-foreground">Content Setup</h3>
              <p className="text-sm text-muted">Add sample content or start fresh</p>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={onNext}
            className="inline-flex items-center px-6 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors font-medium"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}