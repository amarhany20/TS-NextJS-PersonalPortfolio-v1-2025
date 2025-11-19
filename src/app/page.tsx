/**
 * Root Page
 * 
 * Redirects to /home as the default landing page.
 */

import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/home");
}
