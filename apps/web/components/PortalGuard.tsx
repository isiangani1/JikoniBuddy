"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PortalGuard({
  role,
  allowGuest = false,
  children
}: {
  role: "buyer" | "seller" | "admin" | "buddy";
  allowGuest?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("jb_auth") === "true";
    const storedRole = sessionStorage.getItem("jb_role");
    if (!isLoggedIn) {
      if (allowGuest) {
        setIsReady(true);
        return;
      }
      router.replace("/");
      return;
    }
    if (storedRole !== role) {
      router.replace("/");
      return;
    }
    setIsReady(true);
  }, [role, router, allowGuest]);

  if (!isReady) return null;
  return <>{children}</>;
}
