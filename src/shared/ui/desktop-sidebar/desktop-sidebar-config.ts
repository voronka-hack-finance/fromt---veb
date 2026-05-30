export const homeSubmenuItems = [
  { label: "Основной бюджет", href: "/budget" },
  { label: "Доходы и расходы", href: "/operations" },
  { label: "Остаток от дохода", href: "/income" },
  { label: "Инвестиции", href: "/investments" },
  { label: "Нагрузка", href: "/total" },
] as const;

export const mainNavItems = [
  { id: "categories", label: "Категории", href: "/categories" },
  { id: "goals", label: "Цели", href: "/goals" },
  { id: "accounts", label: "Счета", href: "/total" },
  { id: "ai", label: "AI Рекомендации", href: "/recommendations" },
] as const;

export type MainNavId = (typeof mainNavItems)[number]["id"];

function matchesPath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isHomeSectionExpanded(pathname: string) {
  if (pathname === "/") return true;
  if (pathname === "/budget") return true;
  if (pathname.startsWith("/operations")) return true;
  if (pathname === "/income") return true;
  if (pathname === "/investments") return true;

  return false;
}

export function isHomeSubmenuItemActive(pathname: string, href: string) {
  if (href === "/budget") {
    return pathname === "/budget";
  }

  if (href === "/operations") {
    return pathname.startsWith("/operations");
  }

  if (href === "/total") {
    return false;
  }

  return matchesPath(pathname, href);
}

export function getActiveMainNavId(pathname: string): MainNavId | null {
  if (pathname.startsWith("/categories")) return "categories";
  if (pathname.startsWith("/goals")) return "goals";
  if (pathname === "/total") return "accounts";
  if (pathname.startsWith("/recommendations")) return "ai";

  return null;
}
