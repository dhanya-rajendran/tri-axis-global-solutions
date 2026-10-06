import type { Metadata } from "next";
import { Logo } from "@/components/layout/Logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="bg-sidebar relative hidden flex-col justify-between p-12 text-white lg:flex">
        <Logo light />
        <div>
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase">Content management</p>
          <h1 className="mt-4 max-w-md font-serif text-4xl leading-tight">The right talent. The right solutions. The right connections.</h1>
          <p className="mt-4 max-w-sm text-sm text-white/60">Manage jobs, services, insights and enquiries for the TriAxis Global Solutions website.</p>
        </div>
        <p className="text-xs text-white/40">© {new Date().getFullYear()} TriAxis Global Solutions FZE</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
          <p className="text-muted-foreground mt-1 mb-6 text-sm">Use your admin account to continue.</p>
          <LoginForm next={next} />
        </div>
      </div>
    </main>
  );
}
