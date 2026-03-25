"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PortalGuard({
  role,
  children
}: {
  role: "buyer" | "seller" | "admin" | "buddy";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("jb_auth") === "true";
    const storedRole = sessionStorage.getItem("jb_role");
    if (!isLoggedIn || storedRole !== role) {
      router.replace("/");
      return;
    }
    setIsReady(true);
  }, [role, router]);

  if (!isReady) return null;
  return <>{children}</>;
}
