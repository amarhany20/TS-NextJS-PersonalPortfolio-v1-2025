"use client";
import React from "react";

export default function ProfileCard() {
  return (
    <div className="px-6 mb-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-center mb-2">
          <span className="text-xl mr-2">🇪🇬</span>
          <span className="text-xl mr-2">🇹🇷</span>
          <span className="text-sm font-medium text-gray-700">Ammar Hany</span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Cairo, Egypt
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Mersin, Turkey
          </div>
        </div>
      </div>
    </div>
  );
}
