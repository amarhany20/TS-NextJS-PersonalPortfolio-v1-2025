'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Palette } from 'lucide-react';
import { listThemeSummaries } from '@/themes';

interface SiteConfigStepProps {
  data?: {
    theme: string;
    siteTitle: string;
    siteSubtitle?: string;
    description?: string;
  };
  onUpdate: (data: { theme: string; siteTitle: string; siteSubtitle?: string; description?: string }) => void;
  onComplete: () => void;
  onPrev: () => void;
}

export default function SiteConfigStep({ data, onUpdate, onComplete, onPrev }: SiteConfigStepProps) {
  const [formData, setFormData] = useState({
    theme: data?.theme || 'professional-dark',
    siteTitle: data?.siteTitle || '',
    siteSubtitle: data?.siteSubtitle || '',
    description: data?.description || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const themes = listThemeSummaries();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.siteTitle.trim()) {
      newErrors.siteTitle = 'Site title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onUpdate(formData);
      onComplete();
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Site Configuration</h2>
          <p className="text-muted mt-2">
            Customize your site&apos;s appearance and basic information.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Site Title *
              </label>
              <input
                type="text"
                value={formData.siteTitle}
                onChange={(e) => updateField('siteTitle', e.target.value)}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary ${
                  errors.siteTitle ? 'border-danger' : 'border-border'
                }`}
                placeholder="Your Name - Portfolio"
              />
              {errors.siteTitle && (
                <p className="text-sm text-danger">{errors.siteTitle}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Site Subtitle
              </label>
              <input
                type="text"
                value={formData.siteSubtitle}
                onChange={(e) => updateField('siteSubtitle', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Software Engineer · Full-Stack Developer"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Site Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                placeholder="A brief description of your portfolio and what visitors can expect..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-accent-primary" />
              <h3 className="text-lg font-medium text-foreground">Choose Theme</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.theme === theme.id
                      ? 'border-accent-primary bg-accent-primary/5'
                      : 'border-border hover:border-accent-primary/50'
                  }`}
                  onClick={() => updateField('theme', theme.id)}
                >
                  <div className="space-y-2">
                    <div
                      className="w-full h-16 rounded-md border"
                      style={{ background: theme.previewGradient }}
                    />
                    <div>
                      <h4 className="font-medium text-foreground">{theme.name}</h4>
                      <p className="text-sm text-muted">{theme.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <button
            onClick={onPrev}
            className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <button
            onClick={handleNext}
            className="inline-flex items-center px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}