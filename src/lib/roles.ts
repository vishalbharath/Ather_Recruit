import { redirect } from "next/navigation";
import { checkAndSyncUser } from "./auth-sync";
import { OrgRole } from "@prisma/client";

export async function requireRole(allowedRoles: OrgRole[]) {
  const sync = await checkAndSyncUser();
  if (!sync || !sync.dbUser) {
    redirect("/sign-in");
  }

  const { dbUser } = sync;
  
  // Get active workspace membership
  const activeMembership = dbUser.memberships[0];
  if (!activeMembership) {
    redirect("/sign-in");
  }

  const role = activeMembership.role;

  // OWNER has superuser clearance; check if user role matches allowed roles
  const isAllowed = allowedRoles.includes(role) || role === OrgRole.OWNER;
  if (!isAllowed) {
    redirect("/unauthorized");
  }

  return { user: dbUser, organization: activeMembership.organization, role };
}

export async function getActiveWorkspace() {
  const sync = await checkAndSyncUser();
  if (!sync || !sync.dbUser) return null;

  const { dbUser } = sync;
  const activeMembership = dbUser.memberships[0];
  if (!activeMembership) return null;

  return {
    user: dbUser,
    organization: activeMembership.organization,
    role: activeMembership.role,
  };
}
