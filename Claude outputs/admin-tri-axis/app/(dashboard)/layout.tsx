import { count, eq } from "drizzle-orm";
import { Sidebar } from "@/components/layout/Sidebar";
import { UserMenu } from "@/components/layout/UserMenu";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  const [row] = await db.select({ n: count() }).from(enquiries).where(eq(enquiries.status, "new"));
  const websiteUrl = process.env.WEBSITE_URL;

  return (
    <div className="min-h-dvh">
      <Sidebar role={user.role} newEnquiries={Number(row?.n ?? 0)} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-end gap-3 border-b bg-white/90 px-4 backdrop-blur sm:px-6">
          {websiteUrl && (
            <a href={websiteUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground mr-auto ml-12 text-sm lg:ml-0">
              View website ↗
            </a>
          )}
          <UserMenu name={user.name} email={user.email} role={user.role} />
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
