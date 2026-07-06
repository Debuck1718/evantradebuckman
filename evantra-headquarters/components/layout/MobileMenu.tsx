"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { navigation } from "@/lib/navigation";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

export default function MobileMenu() {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger>
          <button
            className="rounded-lg p-2 hover:bg-slate-100 transition"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="flex flex-col"
        >
          <Logo />

          <nav className="mt-10 flex flex-col gap-6">
            {navigation.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="
                  text-lg
                  font-medium
                  text-slate-700
                  hover:text-primary
                  transition-colors
                "
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="mt-auto">
            <Button className="w-full">
              Work With Us
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}