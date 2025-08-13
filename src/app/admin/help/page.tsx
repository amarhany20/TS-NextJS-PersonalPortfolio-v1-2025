/**
 * Help & Instructions Page
 *
 * This page explains how to use your Content Management System
 */

"use client";

import AdminLayout from "@/components/Admin/AdminLayout";
import SectionCard from "@/components/UI/SectionCard";
import SectionHeader from "@/components/UI/SectionHeader";

export default function HelpPage() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
            <SectionHeader title="📚 How to Use Your Portfolio Editor" subtitle="Simple step-by-step instructions to edit your portfolio content" />
          </div>

          {/* Step by Step Guide */}
          <SectionCard className="bg-white">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🚀 Getting Started (Super Easy!)</h2>
            </div>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Step 1: Choose What to Edit</h3>
                <p className="text-gray-700 mb-3">Look at the left sidebar (the menu on the left side of this page). You will see options like:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>
                    <strong>Personal Info</strong> - Your name, email, title, etc.
                  </li>
                  <li>
                    <strong>Experience</strong> - Your work history and jobs
                  </li>
                  <li>
                    <strong>Education</strong> - Your schools and degrees (coming soon)
                  </li>
                  <li>
                    <strong>Skills</strong> - Programming languages you know (coming soon)
                  </li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-xl font-semibold text-green-600 mb-2">Step 2: Click to Open the Editor</h3>
                <p className="text-gray-700 mb-3">Click on any section name in the sidebar. For example:</p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-800">
                    Click <strong>&quot;Personal Info&quot;</strong> to edit your name, email, and job title
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-xl font-semibold text-purple-600 mb-2">Step 3: Fill in the Forms</h3>
                <p className="text-gray-700 mb-3">You will see forms (boxes where you can type) like this:</p>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input type="text" placeholder="Type your name here..." className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled />
                  </div>
                  <p className="text-sm text-gray-600">☝️ Just click in the box and type your information</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-xl font-semibold text-orange-600 mb-2">Step 4: Save Your Changes</h3>
                <p className="text-gray-700 mb-3">When you are done typing, look for a blue button that says:</p>
                <div className="mb-3">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium" disabled>
                    Save Changes
                  </button>
                </div>
                <p className="text-gray-700">Click this button and your portfolio website will update automatically!</p>
              </div>
            </div>
          </SectionCard>

          {/* Common Questions */}
          <SectionCard className="bg-white">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">❓ Common Questions</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Q: What happens when I click &quot;Save Changes&quot;?</h3>
                <p className="text-gray-700">A: Your information gets saved to a database, and your main portfolio website (the one visitors see) updates automatically with your new information.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Q: Can I break something by editing?</h3>
                <p className="text-gray-700">A: No! This system is designed to be safe. You can only edit your content, not the website code. If you make a mistake, just edit it again.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Q: Do I have to fill out everything at once?</h3>
                <p className="text-gray-700">A: No! You can edit sections one at a time. Come back whenever you want to update or add more information.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Q: Where can I see my changes?</h3>
                <p className="text-gray-700">A: Go to your main portfolio website (usually the homepage) and you will see your updated information there.</p>
              </div>
            </div>
          </SectionCard>

          {/* What Each Section Does */}
          <SectionCard className="bg-white">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 What Each Section Does</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">👤 Personal Info</h3>
                <p className="text-gray-700 text-sm">Edit your name, job title, email, phone number, and a short summary about yourself. This appears at the top of your portfolio.</p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-green-600 mb-2">💼 Experience</h3>
                <p className="text-gray-700 text-sm">Add or edit your work history - company names, job titles, what you did, and technologies you used.</p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-500 mb-2">🎓 Education</h3>
                <p className="text-gray-500 text-sm">(Coming Soon) Add your degrees, certifications, and courses.</p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-500 mb-2">🛠️ Skills</h3>
                <p className="text-gray-500 text-sm">(Coming Soon) List programming languages, frameworks, and tools you know.</p>
              </div>
            </div>
          </SectionCard>

          {/* Need More Help */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-blue-800 mb-3">🆘 Still Need Help?</h2>
            <p className="text-blue-700">Don&apos;t worry! Everyone starts somewhere. Try editing just one small thing first, like your name in &quot;Personal Info&quot;. Once you see how easy it is, you&apos;ll be comfortable editing everything else!</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
