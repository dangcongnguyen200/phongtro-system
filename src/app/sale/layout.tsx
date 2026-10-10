import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { SaleSidebar } from "@/components/sale/SaleSidebar";
export const dynamic = "force-dynamic";
export default async function SaleLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "admin") redirect("/admin");
  return (
    <div className="flex min-h-screen">
      <SaleSidebar user={session} />
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}
