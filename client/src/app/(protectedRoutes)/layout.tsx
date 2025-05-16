import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import UserDetailsModal from "@/components/UserDetailsModal";

export default function ProtectedRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Navbar />
      <div className="pt-[7rem] px-[2rem]">{children}</div>
      <UserDetailsModal />
    </ProtectedRoute>
  );
}
