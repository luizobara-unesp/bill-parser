import { cookies } from "next/headers";
import { ProtectedShell } from "@/components/layout/protected-shell";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <ProtectedShell defaultOpen={defaultOpen}>
      {children}
    </ProtectedShell>
  );
}