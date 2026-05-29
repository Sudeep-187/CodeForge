"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Flame, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/dsa", label: "DSA Problems" },
  { href: "/subjects", label: "Subjects" },
  { href: "/compiler", label: "Compiler" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-[#0c0c0c]/80 backdrop-blur-xl border-b border-[#2a2a2a]" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <span className="text-xl font-bold text-[#e5e5e5] font-space-grotesk">CodeForge</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "text-orange-500"
                    : "text-[#a1a1aa] hover:text-[#e5e5e5]"
                )}
              >
                {link.label}
              </Link>
            ))}
            {status === "authenticated" ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5 text-[#e5e5e5]" /> : <Menu className="w-5 h-5 text-[#e5e5e5]" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#141414] border-b border-[#2a2a2a]">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "text-orange-500"
                    : "text-[#a1a1aa] hover:text-[#e5e5e5]"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#2a2a2a]">
              {status === "authenticated" ? (
                <div className="space-y-2">
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button variant="default" className="w-full">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" className="w-full" onClick={() => signOut()}>Logout</Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full">Login</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>
                    <Button variant="primary" className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
