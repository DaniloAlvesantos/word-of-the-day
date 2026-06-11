import { NextRequest, NextResponse, ProxyConfig } from "next/server";

const publicRoutes = [
  { path: "/", whenAuthenticated: "next" },
  { path: "/login", whenAuthenticated: "redirect" },
  { path: "/register", whenAuthenticated: "redirect" },
  { path: "/archive", whenAuthenticated: "next" },
  { path: "/archive/:id", whenAuthenticated: "next" },
  { path: "/synonyms", whenAuthenticated: "next" },
  { path: "/dictionary", whenAuthenticated: "next" },
  { path: "/dictionary/:id", whenAuthenticated: "next" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const authToken = request.cookies.get("lexical-auth-token");
  const publicRoute = publicRoutes.find(
    (route) => route.path === path || matchDynamicRoute(route.path, path),
  );

  if (
    path.startsWith("/favicon") ||
    path.startsWith("/robots") ||
    path.startsWith("/manifest") ||
    path.startsWith("/sitemap") ||
    path.startsWith("/apple-touch-icon") ||
    path.startsWith("/icon-") ||
    path.endsWith(".ico") ||
    path.endsWith(".png") ||
    path.endsWith(".jpg") ||
    path.endsWith(".jpeg") ||
    path.endsWith(".svg") ||
    path.endsWith(".webp") ||
    path.endsWith(".txt") ||
    path.endsWith(".xml") ||
    path.endsWith(".json")
  ) {
    return NextResponse.next();
  }

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (authToken && publicRoute?.whenAuthenticated === "redirect") {
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  if (!authToken && !publicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

const matchDynamicRoute = (pattern: string, actualPath: string): boolean => {
  const patternParts = pattern.split("/");
  const pathParts = actualPath.split("/");

  if (patternParts.length !== pathParts.length) return false;

  return patternParts.every((part, i) => {
    return part.startsWith(":") || part === pathParts[i];
  });
};

export const config: ProxyConfig = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|apple-touch-icon.png|icon.png|manifest.webmanifest).*)",
  ],
};
