"use client";
import Image from "next/image";
import Link from "next/link";
import { Menu, User, Award, LogOut } from "lucide-react";
import { defaultNavigation, NavigationType } from "@/types/navigation";
import { Button } from "../ui/button";
import { createPortal } from "react-dom";
import { AsideMenu } from "../aside";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  navigation?: NavigationType;
}

export const Header = ({ navigation = defaultNavigation }: HeaderProps) => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const handleShow = () => {
    setShow((prev) => !prev);
  };

  return (
    <DropdownMenu>
      <header className="w-full flex items-center justify-between p-2 select-none">
        <Link
          href="/"
          className="relative transition-transform duration-200 active:scale-95"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src="/logo.png"
            alt="Lexical Logo"
            width={120}
            height={50}
            priority
          />
        </Link>

        <nav
          className="items-center gap-6 hidden sm:flex"
          onClick={(e) => e.stopPropagation()}
        >
          {navigation.map((nav) => (
            <Link
              href={nav.href}
              className="uppercase tracking-widest font-semibold text-xs text-zinc-600 transition-colors duration-200 hover:text-app-primary"
              key={nav.href}
            >
              {nav.label}
            </Link>
          ))}
        </nav>

        <Button
          size="icon"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleShow();
          }}
          className="flex sm:hidden rounded-lg border-zinc-200"
          aria-label="Toggle navigation menu"
        >
          <Menu className="size-4 text-zinc-600" />
        </Button>

        <DropdownMenuTrigger asChild>
          <User className="hidden sm:block size-6 mr-4 text-zinc-600 hover:text-app-primary transition-colors cursor-pointer" />
        </DropdownMenuTrigger>

        {show && createPortal(<AsideMenu />, document.body)}
      </header>

      <DropdownMenuContent
        align="end"
        className="w-52 bg-white/95 backdrop-blur-md border border-zinc-200/80 shadow-md rounded-lg py-1 z-50 transform translate-y-1 animate-in fade-in zoom-in-95 duration-100"
      >
        <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold tracking-wider text-zinc-400 select-none">
          Quick Actions
        </div>

        <DropdownMenuSeparator className="bg-zinc-100 my-1" />

        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-md cursor-pointer"
        >
          <Award className="size-4 text-zinc-400" />
          View My Rank & XP
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-md cursor-pointer">
          <LogOut className="size-4 text-zinc-400" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
