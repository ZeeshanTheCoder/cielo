import { Logo } from "@/components/logo";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-8">
        <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-headline text-2xl font-bold text-foreground">Cielo</span>
        </Link>
       </div>
      {children}
    </main>
  );
}
