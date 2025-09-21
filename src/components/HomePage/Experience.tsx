"use client";

import React from "react";
import SectionHeader from "@/components/UI/SectionHeader";
import AccentBar from "@/components/UI/AccentBar";
import SectionCard from "@/components/UI/SectionCard";
import { experience } from "@/temp-data";
import { Briefcase, MapPin, Calendar, Star } from "lucide-react";

export default function Experience() {
  const expData = experience;
  if (!expData.length) {
    return (
      <section id="experience" className="scroll-mt-8">
        <SectionHeader title="Experience" subtitle="My professional journey and key accomplishments" />
        <div className="flex items-center justify-center py-12">
          <p className="text-[var(--text-secondary)]">Static placeholder: add experience in src/data/index.ts</p>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="scroll-mt-8">
      <SectionHeader title="Experience" subtitle="My professional journey and key accomplishments" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
  {expData.map((exp, index) => (
          <SectionCard key={index} hover className="group relative overflow-hidden">
            {/* Decorative elements */}
            <AccentBar direction="primary-to-secondary" />

            <div className="relative z-10 pl-6">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={20} className="text-[var(--accent-primary)]" />
                    <h3 className="text-xl font-bold text-foreground">{exp.position}</h3>
                  </div>
                  <p className="text-[var(--accent-primary)] font-semibold text-lg mb-2">
                    {exp.company}
                    {exp.companyUrl && (
                      <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm font-medium underline text-[var(--accent-secondary)] hover:text-[var(--accent-primary)]">
                        Visit ↗
                      </a>
                    )}
                  </p>
                  <div className="flex items-center gap-4 text-[var(--text-secondary)] text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      {exp.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {exp.duration}
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <div className="mt-4 lg:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${exp.type === "Full-time" ? "bg-[var(--accent-primary)] text-black" : "bg-[var(--accent-muted)] text-[var(--text-secondary)]"}`}>{exp.type}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[var(--accent-secondary)] rounded-full"></span>
                  Role Overview
                </h4>
                <p className="text-[var(--text-secondary)] text-sm">{exp.description}</p>
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Star size={16} className="text-[var(--accent-primary)]" />
                  Key Achievements
                </h4>
                <ul className="space-y-2">
                  {exp.achievements.map((achievement: string, i: number) => (
                    <li key={i} className="text-[var(--text-secondary)] text-sm flex items-start">
                      <span className="text-[var(--success)] mr-3 mt-1 font-bold">✓</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gradient-to-r from-[var(--accent-muted)] to-[var(--accent-muted)] hover:from-[var(--accent-primary)] hover:to-[var(--accent-secondary)] hover:text-black text-[var(--text-secondary)] text-xs rounded-full font-medium transition-all duration-300 cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </section>
  );
}
