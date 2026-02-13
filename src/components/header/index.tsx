import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { defaultNavigation, NavigationType } from "@/types/navigation";

interface HeaderProps {
  navigation?: NavigationType;
}

export const Header = ({ navigation = defaultNavigation }: HeaderProps) => {
  return (
    <header className="w-full flex items-center justify-between p-4">
      <div>
        <Image src="" alt="Logo" />
        <span></span>
      </div>

      <nav>
        <ul className="flex items-center gap-4">
          {navigation.map((nav) => (
            <li key={crypto.randomUUID()}>
                <Link 
                    href={nav.href} 
                    className="uppercase"
                >
                    {nav.label}
                </Link>
            </li>
          ))}
        </ul>
      </nav>

      <span>
        <Search />
      </span>
    </header>
  );
};
