"use client";

import { usePathname } from "next/navigation";

import { BottomNav } from "./bottom-nav";

function shouldShowMobileTabNav(pathname: string) {
  if (pathname === "/") return true;
  if (pathname.startsWith("/operations")) return true;
  if (pathname.startsWith("/goals")) return true;
  if (pathname.startsWith("/categories")) return true;
  if (pathname.startsWith("/recommendations")) {
    return !pathname.includes("/chat");
  }
  if (pathname.startsWith("/settings")) return true;
  if (pathname.startsWith("/profile")) return true;
  if (pathname === "/load") return true;
  if (pathname === "/total") return true;

  return false;
}

export function MobileTabNav() {
  const pathname = usePathname();

  if (!shouldShowMobileTabNav(pathname)) {
    return null;
  }

  return <BottomNav />;
}
