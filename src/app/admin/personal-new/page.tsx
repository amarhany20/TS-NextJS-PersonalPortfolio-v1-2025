/**
 * Personal Information Admin Page - Enhanced
 * Full CRUD operations for personal info and metadata management
 */

"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { AdminPageHeader, AdminCard, AdminFormField, AdminInput, AdminTextarea, AdminButton, AdminAlert, AdminLoadingSpinner } from "@/components/Admin/AdminUI";
import { personalInfoService, type PersonalInfoData, type MetadataItem } from "@/lib/admin-services";
import { Save, Plus, Trash2, Edit3 } from "lucide-react";

export default function PersonalInfoAdminPage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData | null>(null);
  const [metadata, setMetadata] = useState<MetadataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"basic" | "metadata">("basic");

  // Form state
  const [formData, setFormData] = useState<PersonalInfoData>({
    name: "",
    displayName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedIn: "",
    github: "",
    availability: "",
    relocationStatus: "",
    professionalSummary: "",
    careerObjective: "",
  });

  // New metadata form
  const [newMetadata, setNewMetadata] = useState({
    key: "",
    value: "",
    category: "personal",
    subcategory: "",
    description: "",
    type: "string",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [personalResponse, metadataResponse] = await Promise.all([personalInfoService.getPersonalInfo(), personalInfoService.getMetadata("personal")]);

      if (personalResponse.success && personalResponse.data) {
        setPersonalInfo(personalResponse.data);
        setFormData(personalResponse.data);
      }

      if (metadataResponse.success && metadataResponse.data) {
        setMetadata(metadataResponse.data);
      }
    } catch (error) {
      setAlert({ type: "error", message: "Failed to load personal information" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PersonalInfoData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setAlert(null);

    try {
      const response = await personalInfoService.updatePersonalInfo(formData);

      if (response.success) {
        setAlert({ type: "success", message: "Personal information updated successfully!" });
        setPersonalInfo(formData);
      } else {
        setAlert({ type: "error", message: response.error || "Failed to update personal information" });
      }
    } catch (error) {
      setAlert({ type: "error", message: "An unexpected error occurred" });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateMetadata = async () => {
    try {
      const response = await personalInfoService.createMetadata({
        ...newMetadata,
        isRequired: false,
        isActive: true,
      });

      if (response.success && response.data) {
        setMetadata((prev) => [...prev, response.data!]);
        setNewMetadata({
          key: "",
          value: "",
          category: "personal",
          subcategory: "",
          description: "",
          type: "string",
        });
        setAlert({ type: "success", message: "Metadata created successfully!" });
      } else {
        setAlert({ type: "error", message: response.error || "Failed to create metadata" });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Failed to create metadata" });
    }
  };

  const handleDeleteMetadata = async (id: number) => {
    if (!confirm("Are you sure you want to delete this metadata?")) return;

    try {
      const response = await personalInfoService.deleteMetadata(id);

      if (response.success) {
        setMetadata((prev) => prev.filter((item) => item.id !== id));
        setAlert({ type: "success", message: "Metadata deleted successfully!" });
      } else {
        setAlert({ type: "error", message: response.error || "Failed to delete metadata" });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Failed to delete metadata" });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <AdminLoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <AdminPageHeader
          title="Personal Information"
          subtitle="Manage your personal details and metadata"
          icon="👤"
          actions={
            <AdminButton onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
              Save Changes
            </AdminButton>
          }
        />

        {alert && (
          <div className="mb-6">
            <AdminAlert type={alert.type} onClose={() => setAlert(null)}>
              {alert.message}
            </AdminAlert>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { key: "basic", label: "Basic Information" },
              { key: "metadata", label: "Advanced Metadata" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "basic" | "metadata")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key ? "border-[var(--accent-primary)] text-[var(--accent-primary)]" : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border)]"}`}>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Basic Information Tab */}
        {activeTab === "basic" && (
          <AdminCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminFormField label="Full Name" required>
                <AdminInput value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="John Doe" />
              </AdminFormField>

              <AdminFormField label="Display Name" required>
                <AdminInput value={formData.displayName} onChange={(e) => handleInputChange("displayName", e.target.value)} placeholder="John" />
              </AdminFormField>

              <AdminFormField label="Professional Title" required>
                <AdminInput value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} placeholder="Senior Full Stack Developer" />
              </AdminFormField>

              <AdminFormField label="Email Address" required>
                <AdminInput type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="john@example.com" />
              </AdminFormField>

              <AdminFormField label="Phone Number" required>
                <AdminInput type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="+1 (555) 123-4567" />
              </AdminFormField>

              <AdminFormField label="Location" required>
                <AdminInput value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} placeholder="San Francisco, CA" />
              </AdminFormField>

              <AdminFormField label="Website">
                <AdminInput type="url" value={formData.website || ""} onChange={(e) => handleInputChange("website", e.target.value)} placeholder="https://johndoe.com" />
              </AdminFormField>

              <AdminFormField label="LinkedIn Profile">
                <AdminInput type="url" value={formData.linkedIn || ""} onChange={(e) => handleInputChange("linkedIn", e.target.value)} placeholder="https://linkedin.com/in/johndoe" />
              </AdminFormField>

              <AdminFormField label="GitHub Profile">
                <AdminInput type="url" value={formData.github || ""} onChange={(e) => handleInputChange("github", e.target.value)} placeholder="https://github.com/johndoe" />
              </AdminFormField>

              <AdminFormField label="Availability Status" required>
                <AdminInput value={formData.availability} onChange={(e) => handleInputChange("availability", e.target.value)} placeholder="Available for hire" />
              </AdminFormField>

              <AdminFormField label="Relocation Status" required>
                <AdminInput value={formData.relocationStatus} onChange={(e) => handleInputChange("relocationStatus", e.target.value)} placeholder="Open to relocation" />
              </AdminFormField>
            </div>

            <div className="mt-6 space-y-6">
              <AdminFormField label="Professional Summary" required>
                <AdminTextarea value={formData.professionalSummary} onChange={(e) => handleInputChange("professionalSummary", e.target.value)} placeholder="Write a brief professional summary..." rows={4} />
              </AdminFormField>

              <AdminFormField label="Career Objective" required>
                <AdminTextarea value={formData.careerObjective} onChange={(e) => handleInputChange("careerObjective", e.target.value)} placeholder="Describe your career goals and objectives..." rows={3} />
              </AdminFormField>
            </div>
          </AdminCard>
        )}

        {/* Metadata Tab */}
        {activeTab === "metadata" && (
          <div className="space-y-6">
            {/* Create New Metadata */}
            <AdminCard>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Create New Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminFormField label="Key" required>
                  <AdminInput value={newMetadata.key} onChange={(e) => setNewMetadata((prev) => ({ ...prev, key: e.target.value }))} placeholder="personal_phone_primary" />
                </AdminFormField>

                <AdminFormField label="Type">
                  <select
                    value={newMetadata.type}
                    onChange={(e) => setNewMetadata((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-[var(--text-primary)]">
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="json">JSON</option>
                  </select>
                </AdminFormField>

                <AdminFormField label="Category">
                  <AdminInput value={newMetadata.category} onChange={(e) => setNewMetadata((prev) => ({ ...prev, category: e.target.value }))} placeholder="personal" />
                </AdminFormField>

                <AdminFormField label="Subcategory">
                  <AdminInput value={newMetadata.subcategory} onChange={(e) => setNewMetadata((prev) => ({ ...prev, subcategory: e.target.value }))} placeholder="contact" />
                </AdminFormField>

                <div className="md:col-span-2">
                  <AdminFormField label="Value" required>
                    <AdminTextarea value={newMetadata.value} onChange={(e) => setNewMetadata((prev) => ({ ...prev, value: e.target.value }))} placeholder="Enter the metadata value..." rows={2} />
                  </AdminFormField>
                </div>

                <div className="md:col-span-2">
                  <AdminFormField label="Description">
                    <AdminInput value={newMetadata.description} onChange={(e) => setNewMetadata((prev) => ({ ...prev, description: e.target.value }))} placeholder="Brief description of this metadata field" />
                  </AdminFormField>
                </div>

                <div className="md:col-span-2">
                  <AdminButton onClick={handleCreateMetadata} icon={<Plus className="w-4 h-4" />} disabled={!newMetadata.key || !newMetadata.value}>
                    Create Metadata
                  </AdminButton>
                </div>
              </div>
            </AdminCard>

            {/* Existing Metadata */}
            <AdminCard>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Existing Metadata</h3>
              <div className="space-y-4">
                {metadata.length === 0 ? (
                  <p className="text-[var(--text-secondary)] text-center py-8">No metadata found. Create your first metadata entry above.</p>
                ) : (
                  metadata.map((item) => (
                    <div key={item.id} className="p-4 bg-[var(--accent-muted)]/30 rounded-lg border border-[var(--border)]">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-[var(--text-primary)]">{item.key}</h4>
                            <span className="text-xs px-2 py-1 bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] rounded">{item.type}</span>
                            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                              {item.category}
                              {item.subcategory && ` > ${item.subcategory}`}
                            </span>
                          </div>
                          <p className="text-[var(--text-secondary)] text-sm mb-2">
                            <strong>Value:</strong> {item.value}
                          </p>
                          {item.description && (
                            <p className="text-[var(--text-secondary)] text-xs">
                              <strong>Description:</strong> {item.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <AdminButton variant="ghost" size="sm" icon={<Edit3 className="w-4 h-4" />}>
                            Edit
                          </AdminButton>
                          <AdminButton variant="danger" size="sm" icon={<Trash2 className="w-4 h-4" />} onClick={() => handleDeleteMetadata(item.id)}>
                            Delete
                          </AdminButton>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </AdminCard>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
