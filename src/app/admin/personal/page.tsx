/**
 * Personal Information Editor Page
 *
 * 🎯 PURPOSE: This is where you edit your basic personal information that appears on your portfolio
 *
 * 📝 WHAT YOU CAN EDIT HERE:
 * - Your full name and display name
 * - Professional title (like "Software Engineer" or "Web Developer")
 * - Email addresses (primary + professional)
 * - Website URL
 * - Availability status (are you looking for work?)
 * - Relocation willingness (can you move for a job?)
 * - Professional summary (a short paragraph about your experience)
 * - Career objective (what kind of job you want next)
 *
 * 🔧 HOW TO USE:
 * 1. Fill in the forms below with your information
 * 2. Click "Save Changes" at the bottom
 * 3. Your portfolio website will update automatically!
 *
 * 💡 TIP: Don't worry if you don't fill everything out right away -
 *         you can always come back and update it later!
 */

"use client";

import React, { useState, useEffect } from "react";
import SectionCard from "@/components/UI/SectionCard";
import SectionHeader from "@/components/UI/SectionHeader";

interface PersonalInfo {
  name: string;
  displayName: string;
  title: string;
  emails: {
    primary: string;
    professional?: string;
  };
  phones: Record<string, string>;
  addresses: Record<string, string>;
  website?: string;
  availability: string;
  relocationStatus: string;
  professionalSummary: string;
  careerObjective: string;
}

const defaultPersonalInfo: PersonalInfo = {
  name: "",
  displayName: "",
  title: "",
  emails: { primary: "" },
  phones: {},
  addresses: {},
  website: "",
  availability: "",
  relocationStatus: "",
  professionalSummary: "",
  careerObjective: "",
};

export default function PersonalInfoPage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(defaultPersonalInfo);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  const fetchPersonalInfo = async () => {
    try {
      const response = await fetch("/api/admin/personal");
      if (response.ok) {
        const result = await response.json();
        setPersonalInfo({ ...defaultPersonalInfo, ...result.data });
      } else {
        console.error("Failed to fetch personal info");
      }
    } catch (error) {
      console.error("Error fetching personal info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/personal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personalInfo),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Personal information updated successfully!");
      } else {
        setMessage(`Error: ${result.error || "Failed to update"}`);
      }
    } catch (error) {
      console.error("Error saving personal info:", error);
      setMessage("Error: Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof PersonalInfo, value: string | Record<string, string>) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (field: keyof PersonalInfo, subField: string, value: string) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: { ...(prev[field] as Record<string, string>), [subField]: value },
    }));
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-[var(--background)] p-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse text-center py-12">
              <div className="h-8 bg-[var(--accent-muted)] rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-[var(--accent-muted)] rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-[var(--background)] p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-[var(--card-bg)] rounded-xl shadow-md p-6 border border-[var(--border)]">
            <SectionHeader title="Personal Information" subtitle="Update your personal details and contact information" />

            {message && (
              <div
                className={`mt-4 p-4 rounded-lg border ${
                  message.startsWith("Error")
                    ? "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/30"
                    : "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/30"
                }`}>
                {message}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <SectionCard className="bg-[var(--card-bg)]">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">📝 Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Full Name</label>
                <input type="text" value={personalInfo.name} onChange={(e) => updateField("name", e.target.value)} className="w-full px-4 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-foreground" placeholder="Your full name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Display Name</label>
                <input type="text" value={personalInfo.displayName} onChange={(e) => updateField("displayName", e.target.value)} className="w-full px-4 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-foreground" placeholder="Name shown on portfolio" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Professional Title</label>
                <input type="text" value={personalInfo.title} onChange={(e) => updateField("title", e.target.value)} className="w-full px-4 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-foreground" placeholder="e.g., Senior Software Engineer" />
              </div>
            </div>
          </SectionCard>

          {/* Contact Information */}
          <SectionCard className="bg-[var(--card-bg)]">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">📞 Contact Information</h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Primary Email</label>
                  <input type="email" value={personalInfo.emails.primary} onChange={(e) => updateNestedField("emails", "primary", e.target.value)} className="w-full px-4 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-foreground" placeholder="your@email.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Professional Email (Optional)</label>
                  <input
                    type="email"
                    value={personalInfo.emails.professional || ""}
                    onChange={(e) => updateNestedField("emails", "professional", e.target.value)}
                    className="w-full px-4 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-foreground"
                    placeholder="work@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Website (Optional)</label>
                <input type="url" value={personalInfo.website || ""} onChange={(e) => updateField("website", e.target.value)} className="w-full px-4 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-foreground" placeholder="https://yourwebsite.com" />
              </div>
            </div>
          </SectionCard>

          {/* Professional Details */}
          <SectionCard className="bg-[var(--card-bg)]">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">💼 Professional Details</h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Availability Status</label>
                  <select value={personalInfo.availability} onChange={(e) => updateField("availability", e.target.value)} className="w-full px-4 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-foreground">
                    <option value="">Select availability</option>
                    <option value="Available immediately">Available immediately</option>
                    <option value="Available in 2 weeks">Available in 2 weeks</option>
                    <option value="Available in 1 month">Available in 1 month</option>
                    <option value="Not actively looking">Not actively looking</option>
                    <option value="Open to opportunities">Open to opportunities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Relocation Status</label>
                  <select value={personalInfo.relocationStatus} onChange={(e) => updateField("relocationStatus", e.target.value)} className="w-full px-4 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-foreground">
                    <option value="">Select relocation status</option>
                    <option value="Open to relocation">Open to relocation</option>
                    <option value="No relocation">No relocation</option>
                    <option value="Remote only">Remote only</option>
                    <option value="Hybrid preferred">Hybrid preferred</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Professional Summary</label>
                <textarea
                  value={personalInfo.professionalSummary}
                  onChange={(e) => updateField("professionalSummary", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-foreground"
                  placeholder="Brief summary of your professional background and expertise..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Career Objective</label>
                <textarea
                  value={personalInfo.careerObjective}
                  onChange={(e) => updateField("careerObjective", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-foreground"
                  placeholder="Your career goals and what you're looking for in your next role..."
                />
              </div>
            </div>
          </SectionCard>

          {/* Save Button */}
          <div className="bg-[var(--card-bg)] rounded-xl shadow-md p-6 border border-[var(--border)]">
            <div className="flex justify-end">
              <button onClick={handleSave} disabled={isSaving} className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 disabled:bg-[var(--accent-primary)]/50 text-black px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
  </div>
  );
}
