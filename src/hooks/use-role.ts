import { useUser } from "@clerk/nextjs";
import { OrgRole } from "@prisma/client";

export function useRole() {
  const { user, isLoaded, isSignedIn } = useUser();

  const role = (user?.publicMetadata?.role as OrgRole) || OrgRole.RECRUITER;

  const isAdmin = role === OrgRole.ADMIN || role === OrgRole.OWNER;
  const isRecruiter = role === OrgRole.RECRUITER || role === OrgRole.OWNER;
  const isHiringManager = role === OrgRole.HIRING_MANAGER || role === OrgRole.OWNER;

  return {
    role,
    isAdmin,
    isRecruiter,
    isHiringManager,
    isLoaded,
    isSignedIn,
  };
}
