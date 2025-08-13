/**
 * Login Page
 * Authentication page for CRM access
 */

import LoginForm from "@/components/Auth/LoginForm";
import { AuthProvider } from "@/hooks/useAuth";

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
