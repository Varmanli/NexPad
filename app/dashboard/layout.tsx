import { redirect } from "next/navigation";
import Sidebar from "../-component/Sidebar";
import ThemeProvider from "../context/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { getAdminFromCookies } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = getAdminFromCookies();

  if (!admin) {
    redirect("/auth/login");
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 bg-background text-text">
          {children}
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: "#363636", color: "#fff" },
          success: {
            duration: 3000,
            iconTheme: { primary: "#16F2A4", secondary: "#000" },
          },
          error: {
            duration: 5000,
            iconTheme: { primary: "#FB7185", secondary: "#fff" },
          },
        }}
      />
    </ThemeProvider>
  );
}
