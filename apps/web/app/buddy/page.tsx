"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BuddyEntryPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("jb_auth") === "true";
    const role = localStorage.getItem("jb_role");
    if (isLoggedIn && role === "buddy") {
      router.replace("/buddy-portal/dashboard");
      return;
    }
    router.replace("/");
  }, [router]);

  return null;
}
