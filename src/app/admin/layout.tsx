import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-stone-50">
      <AdminNavbar />
      {children}
    </div>
  );
}
