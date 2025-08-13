/* eslint-disable react/no-unescaped-entities */
/**
 * Admin Dashboard - Your Portfolio Content Editor
 *
 * This is the main page where you can edit ALL of your portfolio content.
 * Think of this as the "control center" for your website.
 *
 * HOW TO USE:
 * 1. Click on any section in the left sidebar (Personal Info, Experience, etc.)
 * 2. Fill in the forms and click "Save"
 * 3. Your changes will appear on your main portfolio website immediately
 */

"use client";

import AdminLayout from "@/components/Admin/AdminLayout";
import Link from "next/link";
import { useState } from "react";

export default function AdminDashboard() {
  const [showInstructions, setShowInstructions] = useState(true);

  // These are the sections you can edit in your portfolio
  const editableSections = [
    {
      title: "👤 Personal Information",
      href: "/admin/personal",
      status: "active",
      description: "Edit your name, title, email, phone, summary, career goals",
      example: 'Name: "John Doe" → Title: "Senior Developer"',
    },
    {
      title: "💼 Work Experience",
      href: "/admin/experience",
      status: "active",
      description: "Add/edit your job history, achievements, and skills used",
      example: 'Company: "Google" → Position: "Software Engineer"',
    },
    {
      title: "🎓 Education",
      href: "/admin/education",
      status: "coming-soon",
      description: "Your degrees, certifications, courses, and academic achievements",
      example: 'Degree: "Computer Science" → University: "MIT"',
    },
    {
      title: "🛠️ Technical Skills",
      href: "/admin/skills",
      status: "coming-soon",
      description: "Programming languages, frameworks, tools, and proficiency levels",
      example: "JavaScript: Advanced → React: Expert → Python: Intermediate",
    },
    {
      title: "🚀 Projects Portfolio",
      href: "/admin/projects",
      status: "coming-soon",
      description: "Showcase your work with descriptions, technologies, and links",
      example: 'Project: "E-commerce App" → Tech: "React, Node.js"',
    },
    {
      title: "🏆 Certificates",
      href: "/admin/certificates",
      status: "coming-soon",
      description: "Professional certifications, courses completed, awards",
      example: "AWS Certified → Google Cloud Professional → Scrum Master",
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[var(--bg-primary)] p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Header */}
          <div className="bg-[var(--card-bg)] rounded-xl shadow-lg p-8 border border-[var(--border)]">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">🎨 Welcome to Your Portfolio Editor!</h1>
              <p className="text-xl text-[var(--text-secondary)] mb-6">
                This is where you edit ALL the content on your portfolio website.
                <br />
                Click any section below to start editing your information.
              </p>

              {/* Quick Start Instructions */}
              {showInstructions && (
                <div className="bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 rounded-lg p-6 text-left">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-semibold text-[var(--accent-primary)]">🚀 Quick Start Guide - How to Edit Your Portfolio:</h2>
                    <button onClick={() => setShowInstructions(false)} className="text-[var(--accent-primary)] hover:text-[var(--accent-primary)]/80">
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[var(--text-primary)]">
                    <div>
                      <h3 className="font-medium mb-2">🖱️ How to Edit:</h3>
                      <ol className="space-y-1 text-sm text-[var(--text-secondary)]">
                        <li>1. Click on any "✅ Edit Now" button below</li>
                        <li>2. Fill in the forms with your information</li>
                        <li>3. Click "Save Changes"</li>
                        <li>4. Your website updates automatically!</li>
                      </ol>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">📝 What You Can Edit:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Your name, title, contact info</li>
                        <li>• Work experience and achievements</li>
                        <li>• Education and certifications</li>
                        <li>• Skills and expertise levels</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Editable Sections */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📊 Your Portfolio Sections - Click to Edit</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {editableSections.map((section) => (
                <div key={section.title} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{section.title}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${section.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{section.status === "active" ? "Ready to Edit" : "Coming Soon"}</div>
                    </div>

                    <p className="text-gray-600 mb-3">{section.description}</p>

                    <div className="bg-gray-50 rounded p-3 mb-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Example:</span> {section.example}
                      </p>
                    </div>

                    {section.status === "active" ? (
                      <Link href={section.href} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200 inline-block">
                        ✅ Edit Now
                      </Link>
                    ) : (
                      <div className="w-full bg-gray-300 text-gray-500 text-center py-3 px-4 rounded-lg font-medium cursor-not-allowed">🚧 Under Development</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What is a CMS/Content Management System */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">❓ What is this "Content Management System"?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg mb-3">🤔 Simple Explanation:</h3>
                <p className="mb-4">Think of this like editing your profile on LinkedIn or Facebook, but for your own website!</p>
                <ul className="space-y-2">
                  <li>
                    • <strong>Before:</strong> You had to edit code files to change your info
                  </li>
                  <li>
                    • <strong>Now:</strong> You just fill out forms and click save!
                  </li>
                  <li>
                    • <strong>Result:</strong> Your website updates automatically
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">🔧 How it Works:</h3>
                <ol className="space-y-2">
                  <li>1. You type your info in easy forms</li>
                  <li>2. The system saves it to a database</li>
                  <li>3. Your portfolio website reads from the database</li>
                  <li>4. Visitors see your updated information!</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                <span className="font-semibold">💡 Bottom Line:</span>
                No more editing code! Just use the forms above to update your portfolio content easily.
              </p>
            </div>
          </div>

          {/* About the "Shortcode System" */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🏷️ What's a "Shortcode System"? (Don't Worry About This!)</h2>

            <div className="text-gray-700">
              <p className="mb-4">The "shortcode system" you saw mentioned is actually NOT relevant for your portfolio. That was leftover from the old CRM (Customer Relationship Management) system I built by mistake.</p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">📝 What Shortcodes Usually Are:</h3>
                <p className="mb-2">In WordPress and some CMS systems, shortcodes are like mini-codes you type to add dynamic content:</p>
                <ul className="space-y-1 text-sm">
                  <li>
                    • <code className="bg-gray-100 px-1 rounded">[contact-form]</code> would show a contact form
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1 rounded">[recent-posts]</code> would show your latest blog posts
                  </li>
                  <li>
                    • <code className="bg-gray-100 px-1 rounded">[skills-chart]</code> would show a skills visualization
                  </li>
                </ul>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  <span className="font-semibold">⚠️ For Your Portfolio:</span>
                  You don't need to worry about shortcodes at all! Just use the edit forms above. Your portfolio will work perfectly without any shortcodes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
