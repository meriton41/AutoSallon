"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Menu, X, User, Heart } from "lucide-react";
import { RatingPopup } from "./ratinng-popup";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Vehicles", href: "/vehicles" },
    { name: "About", href: "/about" },
    ...(user && user.role === "User" ? [{ name: "Contact", href: "/contact" }] : []),
    ...(user && user.role === "User" ? [{ name: "Test Drive", href: "//" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 dark:bg-black/90 backdrop-blur shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-primary">
          Nitron
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.dispatchEvent(new Event('open-rating-dialog'))}
            >
              Rate Us
            </Button>
          )}

          {user && user.role === "Admin" && (
            <Link href="/dashboard">
              <Button variant="ghost" className="font-semibold">Dashboard</Button>
            </Link>
          )}

          {user && user.role === "User" && (
            <Link href="/favorites" className="relative">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button variant="destructive" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </nav>

        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setIsOpen(false)} />
        )}
        <div
          className={`fixed top-0 right-0 z-50 h-full w-64 bg-white dark:bg-black shadow-lg transform transition-transform duration-200 md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-bold text-xl">Nitron</span>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-col gap-2 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {user && (
              <Button 
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => {
                  window.dispatchEvent(new Event('open-rating-dialog'))
                  setIsOpen(false)
                }}
              >
                Rate Us
              </Button>
            )}

            {user && user.role === "Admin" && (
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full font-semibold mt-2">Dashboard</Button>
              </Link>
            )}

            {user && user.role === "User" && (
              <Link href="/favorites" className="relative" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 w-full justify-start">
                  <Heart className="h-5 w-5 mr-2" /> Favorites
                </Button>
              </Link>
            )}

            {user ? (
              <>
                <Link href="/profile" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full flex items-center gap-2 mt-2">
                    <User className="h-4 w-4" /> Profile
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" className="w-full mt-2" onClick={() => { logout(); setIsOpen(false); }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full mt-2">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="w-full mt-2">Register</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <RatingPopup />
    </header>
  );
}
