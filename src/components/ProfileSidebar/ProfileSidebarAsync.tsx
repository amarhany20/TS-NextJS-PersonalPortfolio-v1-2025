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
      coreSkills={["Python", "React/Next.js", "Flask/Django", "ASP.NET Core"]}
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

    return <ProfileSidebarClient personalInfo={personalInfo} coreSkills={coreSkills} languages={languages} />;
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
