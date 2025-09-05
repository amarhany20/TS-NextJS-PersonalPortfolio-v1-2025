import { Suspense } from "react";
import { getPersonalInfo, getCoreSkills, getLanguages } from "@/lib/database-services";
import ProfileSidebarClient from "./ProfileSidebarClient";

// Loading fallback component
function ProfileSidebarLoading() {
  return (
    <ProfileSidebarClient
      personalInfo={{
        personal_display_name: "Ammar Hany",
        personal_addresses: { egypt: "New Cairo, Egypt" },
      }}
      coreSkills={[
        { id: 1, name: "Python" },
        { id: 2, name: "React/Next.js" },
        { id: 3, name: "Flask/Django" },
        { id: 4, name: "ASP.NET Core" },
      ]}
      languages={[
        { name: "Arabic", level: "Native", flag: "🇪🇬" },
        { name: "English", level: "C2", flag: "🇺🇸" },
        { name: "Turkish", level: "B2", flag: "🇹🇷" },
        { name: "Swedish", level: "A1", flag: "🇸🇪" },
      ]}
    />
  );
}

// Server component with data fetching
async function ProfileSidebarWithData() {
  try {
    const personalInfo = await getPersonalInfo();
  const coreSkills = await getCoreSkills();
    const languages = await getLanguages();

    return (
      <ProfileSidebarClient
        personalInfo={personalInfo}
        coreSkills={coreSkills.map((s) => ({ id: s.id, name: s.name }))}
        languages={languages}
      />
    );
  } catch (error) {
    console.error("Error loading profile data:", error);
    return <ProfileSidebarLoading />;
  }
}

export default function ProfileSidebar() {
  return (
    <Suspense fallback={<ProfileSidebarLoading />}>
      <ProfileSidebarWithData />
    </Suspense>
  );
}
