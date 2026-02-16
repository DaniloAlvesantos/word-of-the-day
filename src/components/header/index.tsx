import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { defaultNavigation, NavigationType } from "@/types/navigation";
import { Button } from "../ui/button";

interface HeaderProps {
  navigation?: NavigationType;
}

export const Header = ({ navigation = defaultNavigation }: HeaderProps) => {
  return (
    <header className="w-full flex items-center justify-between p-2">
      <Image src="/logo.png" alt="Logo" width={120} height={50} />

      <nav className="flex items-center gap-4">
        {navigation.map((nav) => (
          <Link
            href={nav.href}
            className="uppercase tracking-widest font-medium text-sm"
            key={crypto.randomUUID()}
          >
            {nav.label}
          </Link>
        ))}
      </nav>

      <Link href="/search" className="w-30">
        <Button size="icon" variant="outline">
          <Search tabIndex={0} />
        </Button>
      </Link>
    </header>
  );
};
