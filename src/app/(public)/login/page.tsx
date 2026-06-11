"use client";
import { useState } from "react";
import Link from "next/link";
import { loginWithEmail } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await loginWithEmail(formData);

    if (result?.error) {
      setErrorMsg(result.error);
      setIsLoading(false);
    }
  }

  return (
    <section className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md bg-white border border-zinc-200/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center space-y-2">
          <h1 className="font-serif font-bold text-2xl tracking-wide text-zinc-900">
            Welcome to Lexical
          </h1>
          <p className="text-sm text-zinc-400">
            Sign in to track your vocabulary milestones and XP progress.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs sm:text-sm font-medium text-red-600 animate-in shake duration-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
            >
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isLoading}
              className="w-full py-2.5 px-3.5 border-zinc-200/80 focus-visible:ring-[3px] focus-visible:ring-app-primary/20 focus-visible:border-app-primary"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-zinc-400 hover:text-app-primary transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              className="w-full py-2.5 px-3.5 border-zinc-200/80 focus-visible:ring-[3px] focus-visible:ring-app-primary/20 focus-visible:border-app-primary"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-app-primary hover:bg-app-primary/90 text-white font-medium py-5 shadow-sm rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-app-primary hover:underline transition-all"
            >
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
