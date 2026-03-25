import React from "react";
import PortalHeader from "@/components/PortalHeader";
import PortalGuard from "@/components/PortalGuard";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PortalGuard role="admin">
        <PortalHeader portalName="Admin Portal" />
        {children}
      </PortalGuard>
    </>
  );
}
