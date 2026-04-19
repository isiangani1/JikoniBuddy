import React from "react";
import PortalGuard from "@/components/PortalGuard";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PortalGuard role="admin">
        <AdminShell>{children}</AdminShell>
      </PortalGuard>
    </>
  );
}
