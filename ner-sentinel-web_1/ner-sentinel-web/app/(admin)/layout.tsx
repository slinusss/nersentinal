import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { AppNav, type NavLink } from "@/components/layout/app-nav";
import { ForceDarkTheme } from "@/components/layout/force-dark-theme";

const ADMIN_LINKS: NavLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/map", label: "Live safety map" },
  { href: "/reports", label: "Reports" },
  { href: "/investigations", label: "Investigations" },
  { href: "/incidents", label: "Incidents" },
  { href: "/intelligence", label: "AI intelligence" },
  { href: "/analytics", label: "Analytics" },
  { href: "/audit", label: "Audit log" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect(profile.role === "official" ? "/assignments" : "/report");

  return (
    // Command console: forced dark regardless of system preference, same
    // convention JanReport's officer console uses. See ForceDarkTheme for
    // why the class is applied to <html> rather than a wrapper div.
    <div className="dark flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <script
        dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('dark')` }}
      />
      <ForceDarkTheme />
      <AppNav links={ADMIN_LINKS} fullName={profile.name} roleBadge={profile.role} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
