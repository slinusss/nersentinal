import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { AppNav, type NavLink } from "@/components/layout/app-nav";

const OFFICIAL_LINKS: NavLink[] = [
  { href: "/assignments", label: "Assignments" },
  { href: "/investigation", label: "Investigation" },
  { href: "/evidence", label: "Evidence" },
];

export default async function OfficialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "official") redirect(profile.role === "admin" ? "/dashboard" : "/report");

  return (
    <div className="flex flex-1 flex-col">
      <AppNav links={OFFICIAL_LINKS} fullName={profile.name} roleBadge={profile.role} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
