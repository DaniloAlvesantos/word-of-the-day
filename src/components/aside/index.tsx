"use client";
import { defaultNavigation, NavigationType } from "@/types/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface AsideMenuProps {
  navigation?: NavigationType;
  isOpen?: boolean;
}

export const AsideMenu = ({
  navigation = defaultNavigation,
  isOpen,
}: AsideMenuProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-2 top-2 bottom-2 rounded-xl bg-zinc-50/80 backdrop-blur-md border border-zinc-200/60 p-5 w-60 text-zinc-800 flex flex-col justify-between shadow-sm z-40 animate-in fade-in slide-in-from-left-2 duration-300 ${isOpen ? "translate-x-0" : "-translate-0"}`}
    >
      <div className="space-y-8">
        <div className="flex items-center px-2 pt-2">
          <Image
            src="/logo.png"
            alt="Lexical Logo"
            sizes="24px"
            priority
            className="object-contain mx-auto"
            width={120}
            height={50}
          />
        </div>

        <nav className="space-y-1" aria-label="Main Navigation">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-app-primary text-white shadow-md shadow-app-primary/10 font-semibold"
                    : "text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-zinc-200/60 pt-4 px-2 flex flex-col gap-0.5 text-[11px] text-zinc-400">
        <p className="font-medium text-zinc-500">Advanced English Platform</p>
        <p className="font-mono opacity-80">v1.1.0</p>
      </div>
    </aside>
  );
};
