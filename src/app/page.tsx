/**
 * Root Page
 *
 * Redirects to /home if setup is complete, otherwise to /setup.
 */

import { redirect } from "next/navigation";
import { SetupService } from "@/server/services/SetupService";

export default async function RootPage() {
  const isConfigured = await SetupService.isDatabaseConfigured();
  if (!isConfigured) {
    redirect("/setup");
  }

  try {
    const status = await SetupService.getSetupStatus();
    if (!status.isSetupComplete) {
      redirect("/setup");
    }
  } catch {
    redirect("/setup");
  }

  redirect("/home");
}
