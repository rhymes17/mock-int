import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "./(protectedRoutes)/dashboard/page";

export default function Home() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
