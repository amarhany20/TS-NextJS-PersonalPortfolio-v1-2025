/**
 * Register Page
 * Registration page for creating admin accounts
 */

import RegisterForm from "@/components/Auth/RegisterForm";
import { AuthProvider } from "@/hooks/useAuth";

export default function RegisterPage() {
  return (
    <AuthProvider>
      <RegisterForm />
    </AuthProvider>
  );
}
