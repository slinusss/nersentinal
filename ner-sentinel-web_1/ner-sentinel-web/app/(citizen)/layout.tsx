import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { AppNav, type NavLink } from "@/components/layout/app-nav";

const CITIZEN_LINKS: NavLink[] = [
  { href: "/report", label: "Report hazard" },
  { href: "/my-reports", label: "My reports" },
  { href: "/map", label: "Safe route map" },
  { href: "/alerts", label: "Alerts" },
];

export default async function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "citizen") redirect("/dashboard");

  return (
    <div className="flex flex-1 flex-col">
      <AppNav links={CITIZEN_LINKS} fullName={profile.name} roleBadge={profile.role} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
