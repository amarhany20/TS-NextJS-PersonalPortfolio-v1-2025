'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface AdminAccountStepProps {
  data?: {
    username: string;
    email: string;
    displayName: string;
    password: string;
  };
  onUpdate: (data: { username: string; email: string; displayName: string; password: string }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function AdminAccountStep({ data, onUpdate, onNext, onPrev }: AdminAccountStepProps) {
  const [formData, setFormData] = useState({
    username: data?.username || '',
    email: data?.email || '',
    displayName: data?.displayName || '',
    password: data?.password || '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onUpdate({
        username: formData.username,
        email: formData.email,
        displayName: formData.displayName,
        password: formData.password,
      });
      onNext();
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
          <h2 className="text-2xl font-bold text-foreground">Create Admin Account</h2>
          <p className="text-muted mt-2">
            This account will be used to manage your portfolio content.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Username *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => updateField('username', e.target.value)}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary ${
                  errors.username ? 'border-danger' : 'border-border'
                }`}
                placeholder="admin"
              />
              {errors.username && (
                <p className="text-sm text-danger">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Display Name *
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => updateField('displayName', e.target.value)}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary ${
                  errors.displayName ? 'border-danger' : 'border-border'
                }`}
                placeholder="Portfolio Admin"
              />
              {errors.displayName && (
                <p className="text-sm text-danger">{errors.displayName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary ${
                errors.email ? 'border-danger' : 'border-border'
              }`}
              placeholder="admin@example.com"
            />
            {errors.email && (
              <p className="text-sm text-danger">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className={`w-full px-3 py-2 pr-10 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary ${
                    errors.password ? 'border-danger' : 'border-border'
                  }`}
                  placeholder="Enter a secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-danger">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Confirm Password *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary ${
                  errors.confirmPassword ? 'border-danger' : 'border-border'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-danger">{errors.confirmPassword}</p>
              )}
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