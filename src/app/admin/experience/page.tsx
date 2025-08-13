/**
 * Work Experience Admin Page
 * Full CRUD operations for managing work experience entries
 */

"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/Admin/AdminLayout";
import { AdminPageHeader, AdminCard, AdminFormField, AdminInput, AdminTextarea, AdminButton, AdminAlert, AdminLoadingSpinner, AdminModal } from "@/components/Admin/AdminUI";
import { experienceService, type AdminExperience, type ExperienceData } from "@/lib/admin-services";
import { Plus, Edit3, Trash2, Save, X, Calendar, MapPin, Building, ChevronUp, ChevronDown } from "lucide-react";

export default function ExperienceAdminPage() {
  const [experiences, setExperiences] = useState<AdminExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<AdminExperience | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ExperienceData>({
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    responsibilities: [],
    achievements: [],
    technologies: [],
    projectHighlights: [],
    displayOrder: 0,
    isActive: true,
  });

  // Responsibilities and achievements input helpers
  const [newResponsibility, setNewResponsibility] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [newTechnology, setNewTechnology] = useState("");
  const [newProjectHighlight, setNewProjectHighlight] = useState("");

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    setLoading(true);
    try {
      const response = await experienceService.getAllExperience();
      if (response.success && response.data) {
        setExperiences(response.data);
      } else {
        setAlert({ type: "error", message: response.error || "Failed to load experiences" });
      }
    } catch {
      setAlert({ type: "error", message: "Failed to load experiences" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      responsibilities: [],
      achievements: [],
      technologies: [],
      projectHighlights: [],
      displayOrder: experiences.length,
      isActive: true,
    });
    setNewResponsibility("");
    setNewAchievement("");
    setNewTechnology("");
    setNewProjectHighlight("");
    setEditingExperience(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (experience: AdminExperience) => {
    setFormData({
      company: experience.company,
      position: experience.position,
      location: experience.location || "",
      startDate: experience.startDate,
      endDate: experience.endDate || "",
      current: experience.current,
      description: experience.description || "",
      responsibilities: experience.responsibilities || [],
      achievements: experience.achievements || [],
      technologies: experience.technologies || [],
      projectHighlights: experience.projectHighlights || [],
      displayOrder: experience.displayOrder,
      isActive: experience.isActive,
    });
    setEditingExperience(experience);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleInputChange = (field: keyof ExperienceData, value: string | boolean | string[] | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (arrayField: "responsibilities" | "achievements" | "technologies" | "projectHighlights", value: string, setter: (value: string) => void) => {
    if (!value.trim()) return;

    const currentArray = formData[arrayField];
    handleInputChange(arrayField, [...currentArray, value.trim()]);
    setter("");
  };

  const removeArrayItem = (arrayField: "responsibilities" | "achievements" | "technologies" | "projectHighlights", index: number) => {
    const currentArray = formData[arrayField];
    handleInputChange(
      arrayField,
      currentArray.filter((_, i) => i !== index)
    );
  };

  const handleSave = async () => {
    setModalLoading(true);
    setAlert(null);

    try {
      let response;

      if (editingExperience) {
        response = await experienceService.updateExperience(editingExperience.id, formData);
      } else {
        response = await experienceService.createExperience(formData);
      }

      if (response.success) {
        setAlert({
          type: "success",
          message: `Experience ${editingExperience ? "updated" : "created"} successfully!`,
        });
        closeModal();
        loadExperiences();
      } else {
        setAlert({ type: "error", message: response.error || "Failed to save experience" });
      }
    } catch {
      setAlert({ type: "error", message: "An unexpected error occurred" });
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      const response = await experienceService.deleteExperience(id);

      if (response.success) {
        setAlert({ type: "success", message: "Experience deleted successfully!" });
        loadExperiences();
      } else {
        setAlert({ type: "error", message: response.error || "Failed to delete experience" });
      }
    } catch {
      setAlert({ type: "error", message: "Failed to delete experience" });
    }
  };

  const handleReorder = async (id: number, direction: "up" | "down") => {
    try {
      const response = await experienceService.reorderExperience(id, direction);

      if (response.success) {
        loadExperiences();
      } else {
        setAlert({ type: "error", message: response.error || "Failed to reorder experience" });
      }
    } catch {
      setAlert({ type: "error", message: "Failed to reorder experience" });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
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
      <div className="p-6 max-w-6xl mx-auto">
        <AdminPageHeader
          title="Work Experience"
          subtitle="Manage your professional work experience"
          icon="💼"
          actions={
            <AdminButton onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
              Add Experience
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

        {/* Experience List */}
        <div className="space-y-4">
          {experiences.length === 0 ? (
            <AdminCard>
              <div className="text-center py-12">
                <Building className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No experience entries found</h3>
                <p className="text-[var(--text-secondary)] mb-6">Get started by adding your first work experience.</p>
                <AdminButton onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
                  Add Your First Experience
                </AdminButton>
              </div>
            </AdminCard>
          ) : (
            experiences.map((experience, index) => (
              <AdminCard key={experience.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-1">{experience.position}</h3>
                        <div className="flex items-center space-x-4 text-[var(--text-secondary)] mb-3">
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span>{experience.company}</span>
                          </div>
                          {experience.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{experience.location}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(experience.startDate)} - {experience.current ? "Present" : formatDate(experience.endDate || "")}
                            </span>
                          </div>
                        </div>

                        {experience.description && <p className="text-[var(--text-secondary)] mb-3">{experience.description}</p>}

                        {/* Technologies */}
                        {experience.technologies && experience.technologies.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Technologies:</h4>
                            <div className="flex flex-wrap gap-2">
                              {experience.technologies.map((tech, techIndex) => (
                                <span key={techIndex} className="px-2 py-1 bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] rounded-md text-xs">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Key Achievements */}
                        {experience.achievements && experience.achievements.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Key Achievements:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-[var(--text-secondary)]">
                              {experience.achievements.slice(0, 3).map((achievement, achIndex) => (
                                <li key={achIndex}>{achievement}</li>
                              ))}
                              {experience.achievements.length > 3 && <li className="text-[var(--accent-primary)]">+{experience.achievements.length - 3} more...</li>}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    {/* Reorder buttons */}
                    <div className="flex flex-col">
                      <AdminButton variant="ghost" size="sm" onClick={() => handleReorder(experience.id, "up")} disabled={index === 0} icon={<ChevronUp className="w-4 h-4" />} />
                      <AdminButton variant="ghost" size="sm" onClick={() => handleReorder(experience.id, "down")} disabled={index === experiences.length - 1} icon={<ChevronDown className="w-4 h-4" />} />
                    </div>

                    <AdminButton variant="ghost" size="sm" onClick={() => openEditModal(experience)} icon={<Edit3 className="w-4 h-4" />}>
                      Edit
                    </AdminButton>
                    <AdminButton variant="danger" size="sm" onClick={() => handleDelete(experience.id)} icon={<Trash2 className="w-4 h-4" />}>
                      Delete
                    </AdminButton>
                  </div>
                </div>
              </AdminCard>
            ))
          )}
        </div>

        {/* Create/Edit Modal */}
        <AdminModal isOpen={modalOpen} onClose={closeModal} title={editingExperience ? "Edit Experience" : "Add New Experience"} size="xl">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormField label="Company" required>
                <AdminInput value={formData.company} onChange={(e) => handleInputChange("company", e.target.value)} placeholder="Microsoft, Google, etc." />
              </AdminFormField>

              <AdminFormField label="Position" required>
                <AdminInput value={formData.position} onChange={(e) => handleInputChange("position", e.target.value)} placeholder="Senior Software Engineer" />
              </AdminFormField>

              <AdminFormField label="Location">
                <AdminInput value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} placeholder="San Francisco, CA" />
              </AdminFormField>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="current" checked={formData.current} onChange={(e) => handleInputChange("current", e.target.checked)} className="rounded border-[var(--border)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]" />
                <label htmlFor="current" className="text-sm font-medium text-[var(--text-primary)]">
                  Current Position
                </label>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormField label="Start Date" required>
                <AdminInput type="date" value={formData.startDate} onChange={(e) => handleInputChange("startDate", e.target.value)} />
              </AdminFormField>

              {!formData.current && (
                <AdminFormField label="End Date">
                  <AdminInput type="date" value={formData.endDate} onChange={(e) => handleInputChange("endDate", e.target.value)} />
                </AdminFormField>
              )}
            </div>

            {/* Description */}
            <AdminFormField label="Description">
              <AdminTextarea value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Brief description of the role and company..." rows={3} />
            </AdminFormField>

            {/* Technologies */}
            <div>
              <AdminFormField label="Technologies">
                <div className="flex space-x-2 mb-2">
                  <AdminInput
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="React, Node.js, etc."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addArrayItem("technologies", newTechnology, setNewTechnology);
                      }
                    }}
                  />
                  <AdminButton onClick={() => addArrayItem("technologies", newTechnology, setNewTechnology)} icon={<Plus className="w-4 h-4" />}>
                    Add
                  </AdminButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] rounded-full text-sm flex items-center space-x-1">
                      <span>{tech}</span>
                      <button onClick={() => removeArrayItem("technologies", index)} className="text-red-400 hover:text-red-300">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </AdminFormField>
            </div>

            {/* Responsibilities */}
            <div>
              <AdminFormField label="Key Responsibilities">
                <div className="flex space-x-2 mb-2">
                  <AdminInput
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    placeholder="Led development team of 5 engineers..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addArrayItem("responsibilities", newResponsibility, setNewResponsibility);
                      }
                    }}
                  />
                  <AdminButton onClick={() => addArrayItem("responsibilities", newResponsibility, setNewResponsibility)} icon={<Plus className="w-4 h-4" />}>
                    Add
                  </AdminButton>
                </div>
                <ul className="space-y-2">
                  {formData.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start space-x-2 p-2 bg-[var(--accent-muted)]/30 rounded">
                      <span className="flex-1 text-sm text-[var(--text-primary)]">{responsibility}</span>
                      <button onClick={() => removeArrayItem("responsibilities", index)} className="text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </AdminFormField>
            </div>

            {/* Achievements */}
            <div>
              <AdminFormField label="Key Achievements">
                <div className="flex space-x-2 mb-2">
                  <AdminInput
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    placeholder="Increased system performance by 40%..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addArrayItem("achievements", newAchievement, setNewAchievement);
                      }
                    }}
                  />
                  <AdminButton onClick={() => addArrayItem("achievements", newAchievement, setNewAchievement)} icon={<Plus className="w-4 h-4" />}>
                    Add
                  </AdminButton>
                </div>
                <ul className="space-y-2">
                  {formData.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start space-x-2 p-2 bg-[var(--accent-muted)]/30 rounded">
                      <span className="flex-1 text-sm text-[var(--text-primary)]">{achievement}</span>
                      <button onClick={() => removeArrayItem("achievements", index)} className="text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </AdminFormField>
            </div>

            {/* Project Highlights */}
            <div>
              <AdminFormField label="Project Highlights">
                <div className="flex space-x-2 mb-2">
                  <AdminInput
                    value={newProjectHighlight}
                    onChange={(e) => setNewProjectHighlight(e.target.value)}
                    placeholder="Built real-time chat system serving 1M+ users..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addArrayItem("projectHighlights", newProjectHighlight, setNewProjectHighlight);
                      }
                    }}
                  />
                  <AdminButton onClick={() => addArrayItem("projectHighlights", newProjectHighlight, setNewProjectHighlight)} icon={<Plus className="w-4 h-4" />}>
                    Add
                  </AdminButton>
                </div>
                <ul className="space-y-2">
                  {formData.projectHighlights.map((highlight, index) => (
                    <li key={index} className="flex items-start space-x-2 p-2 bg-[var(--accent-muted)]/30 rounded">
                      <span className="flex-1 text-sm text-[var(--text-primary)]">{highlight}</span>
                      <button onClick={() => removeArrayItem("projectHighlights", index)} className="text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </AdminFormField>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-[var(--border)]">
              <AdminButton variant="ghost" onClick={closeModal}>
                Cancel
              </AdminButton>
              <AdminButton onClick={handleSave} loading={modalLoading} icon={<Save className="w-4 h-4" />} disabled={!formData.company || !formData.position || !formData.startDate}>
                {editingExperience ? "Update Experience" : "Create Experience"}
              </AdminButton>
            </div>
          </div>
        </AdminModal>
      </div>
    </AdminLayout>
  );
}
