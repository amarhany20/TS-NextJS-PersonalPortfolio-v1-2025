/**
 * Contact Leads Management Page
 *
 * 🎯 PURPOSE: Manage contact leads - people who contacted you
 * 📧 FEATURES: View, respond to, and manage contact submissions
 * 🔔 NOTIFICATIONS: See new contact requests and follow-ups needed
 */

"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/Admin/AdminLayout";

interface ContactLead {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: string;
  repliedAt?: string;
  notes?: string;
  source: "contact_form" | "email" | "linkedin" | "other";
}

export default function ContactLeadsPage() {
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<ContactLead | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "replied" | "archived">("all");

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    const mockLeads: ContactLead[] = [
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah.johnson@techcorp.com",
        subject: "Full Stack Developer Position",
        message: "Hi Ammar, I came across your portfolio and I'm impressed with your work. We have a full-stack developer position that might interest you. Would you be open to discussing this opportunity?",
        status: "new",
        createdAt: "2025-07-22T10:30:00Z",
        source: "contact_form",
      },
      {
        id: "2",
        name: "Ahmed Mohamed",
        email: "ahmed.m@startup.io",
        subject: "React Project Collaboration",
        message: "Hello! I saw your React projects on GitHub. We're working on a similar project and would love to collaborate. Are you available for freelance work?",
        status: "read",
        createdAt: "2025-07-21T14:15:00Z",
        source: "linkedin",
      },
      {
        id: "3",
        name: "Lisa Chen",
        email: "lisa.chen@designstudio.com",
        subject: "UI/UX Development Services",
        message: "Hi Ammar, we need someone with your full-stack skills to implement our designs. The project involves React, Next.js, and Node.js. Could we schedule a call?",
        status: "replied",
        createdAt: "2025-07-20T09:45:00Z",
        repliedAt: "2025-07-20T16:30:00Z",
        notes: "Replied with availability and rate information",
        source: "contact_form",
      },
    ];

    setTimeout(() => {
      setLeads(mockLeads);
      setLoading(false);
    }, 500);
  }, []);

  const filteredLeads = leads.filter((lead) => filter === "all" || lead.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-red-100 text-red-800";
      case "read":
        return "bg-yellow-100 text-yellow-800";
      case "replied":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "contact_form":
        return "📝";
      case "email":
        return "📧";
      case "linkedin":
        return "💼";
      default:
        return "💬";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const updateLeadStatus = (leadId: string, newStatus: ContactLead["status"]) => {
    setLeads((prev) => prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead)));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">Contact Leads</h1>
              <p className="text-[var(--text-secondary)] mt-2">Manage people who have contacted you</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]">{leads.filter((l) => l.status === "new").length} New</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400">{leads.filter((l) => l.status === "read").length} Unread</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-[var(--border)] mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: "all", label: "All Contacts", count: leads.length },
              { key: "new", label: "New", count: leads.filter((l) => l.status === "new").length },
              { key: "read", label: "Read", count: leads.filter((l) => l.status === "read").length },
              { key: "replied", label: "Replied", count: leads.filter((l) => l.status === "replied").length },
              { key: "archived", label: "Archived", count: leads.filter((l) => l.status === "archived").length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as "all" | "new" | "read" | "replied" | "archived")}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${filter === tab.key ? "border-[var(--accent-primary)] text-[var(--accent-primary)]" : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border)]"}`}>
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Leads List */}
        <div className="space-y-4">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-[var(--text-secondary)] text-6xl mb-4">📬</div>
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No contacts yet</h3>
              <p className="text-[var(--text-secondary)]">{filter === "all" ? "You haven't received any contact messages yet." : `No contacts with status "${filter}".`}</p>
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <div key={lead.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer ${lead.status === "new" ? "ring-2 ring-blue-200" : ""}`} onClick={() => setSelectedLead(lead)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xl">{getSourceIcon(lead.source)}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>{lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</span>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">{lead.email}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(lead.createdAt)}</span>
                    </div>

                    <h4 className="font-medium text-gray-900 mb-2">{lead.subject}</h4>
                    <p className="text-gray-600 text-sm line-clamp-2">{lead.message}</p>
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                      {lead.status === "new" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateLeadStatus(lead.id, "read");
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                          Mark Read
                        </button>
                      )}

                      {(lead.status === "new" || lead.status === "read") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Open email client or show reply modal
                            window.open(`mailto:${lead.email}?subject=Re: ${lead.subject}`);
                            updateLeadStatus(lead.id, "replied");
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700">
                          Reply
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {lead.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Note:</span> {lead.notes}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedLead(null)} />

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedLead.name}</h3>
                      <p className="text-sm text-gray-500">{selectedLead.email}</p>
                    </div>
                    <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Subject</label>
                      <p className="text-gray-900">{selectedLead.subject}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Message</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedLead.message}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-gray-500">Received</label>
                        <p className="text-gray-900">{formatDate(selectedLead.createdAt)}</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-500">Source</label>
                        <p className="text-gray-900 capitalize">{selectedLead.source.replace("_", " ")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={() => {
                      window.open(`mailto:${selectedLead.email}?subject=Re: ${selectedLead.subject}`);
                      updateLeadStatus(selectedLead.id, "replied");
                      setSelectedLead(null);
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm">
                    Reply via Email
                  </button>
                  <button onClick={() => setSelectedLead(null)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
