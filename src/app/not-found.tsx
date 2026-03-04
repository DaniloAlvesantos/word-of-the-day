import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center h-dvh w-full">
      <span>404</span>
      <h1 className="text-4xl">Page not found</h1>
      <p>Sorry, we coulnd&apos;t find the page you&apos;re looking for</p>
      <Link href="/">
        <Button variant="link">
          <ArrowLeft /> Back to today&apos;s word
        </Button>
      </Link>
    </main>
  );
}
