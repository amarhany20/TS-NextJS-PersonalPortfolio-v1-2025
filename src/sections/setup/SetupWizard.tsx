'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeStep from './WelcomeStep';
import DatabaseStep from './DatabaseStep';
import AdminAccountStep from './AdminAccountStep';
import SiteConfigStep from './SiteConfigStep';
import ContentSetupStep from './ContentSetupStep';
import ProgressIndicator from './ProgressIndicator';

export type SetupStep = 'welcome' | 'database' | 'admin' | 'site';

export interface SetupData {
  database: {
    type: 'postgresql';
    connectionString?: string;
  };
  admin: {
    username: string;
    email: string;
    displayName: string;
    password: string;
  };
  site: {
    theme: string;
    siteTitle: string;
    siteSubtitle?: string;
    description?: string;
  };
  content: {
    includeSampleData: boolean;
  };
}


const STEPS: { id: SetupStep; title: string; description: string }[] = [
  { id: 'welcome', title: 'Welcome', description: 'Get started with your portfolio' },
  { id: 'database', title: 'Database', description: 'Configure your database' },
  { id: 'admin', title: 'Admin Account', description: 'Create your admin account' },
  { id: 'site', title: 'Site Configuration', description: 'Customize your site' },
];

export default function SetupWizard() {
  const [currentStep, setCurrentStep] = useState<SetupStep>('welcome');
  const [setupData, setSetupData] = useState<Partial<SetupData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const currentStepIndex = STEPS.findIndex(step => step.id === currentStep);

  const updateSetupData = (stepData: Partial<SetupData>) => {
    setSetupData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const defaultSeed = process.env.NEXT_PUBLIC_SEED_SAMPLE_DATA === 'true';
      const completeSetupData = {
        ...setupData,
        content: setupData.content ?? { includeSampleData: defaultSeed },
      };


      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeSetupData),
      });

      if (!response.ok) {
        throw new Error('Setup failed');
      }

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (error) {
      console.error('Setup error:', error);
      // Handle error - could show a toast or error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep onNext={nextStep} />;
      case 'database':
        return (
          <DatabaseStep
            data={setupData.database}
            onUpdate={(data) => updateSetupData({ database: data })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'admin':
        return (
          <AdminAccountStep
            data={setupData.admin}
            onUpdate={(data) => updateSetupData({ admin: data })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'site':
        return (
          <SiteConfigStep
            data={setupData.site}
            onUpdate={(data) => updateSetupData({ site: data })}
            onComplete={handleComplete}
            onPrev={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <ProgressIndicator steps={STEPS} currentStep={currentStep} />

          <div className="mt-8">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
}
