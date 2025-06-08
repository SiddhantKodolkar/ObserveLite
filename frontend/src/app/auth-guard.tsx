'use client'

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    const isAdminPage = pathname === "/admin";

    if (!isAdmin && !isAdminPage) {
      router.push("/admin");
    }
  }, [pathname]);

  return <>{children}</>;
}
