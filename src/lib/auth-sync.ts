import { currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";
import { OrgRole } from "@prisma/client";

export async function checkAndSyncUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "User";
  const avatarUrl = clerkUser.imageUrl;

  // Retrieve user role from Clerk public metadata (default to RECRUITER if none exists)
  const clerkRole = (clerkUser.publicMetadata?.role as OrgRole) || OrgRole.RECRUITER;

  // Find or create the user in the database
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      memberships: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email,
        name,
        avatarUrl,
      },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    // Onboard user into a default Organization workspace to support multi-tenancy seamlessly
    const defaultOrgSlug = `org-${clerkUser.id.substring(5, 13).toLowerCase()}`;
    const org = await prisma.organization.create({
      data: {
        name: `${clerkUser.firstName ?? "Aether"}'s Workspace`,
        slug: defaultOrgSlug,
      },
    });

    // Associate user with organization as OWNER
    await prisma.membership.create({
      data: {
        userId: dbUser.id,
        organizationId: org.id,
        role: OrgRole.OWNER,
      },
    });

    // Re-fetch with organization bindings
    dbUser = await prisma.user.findUnique({
      where: { id: dbUser.id },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    }) as any;
  } else {
    // If the database cache of name/avatar is stale, run sync update
    if (dbUser.name !== name || dbUser.avatarUrl !== avatarUrl || dbUser.email !== email) {
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: { name, avatarUrl, email },
        include: {
          memberships: {
            include: {
              organization: true,
            },
          },
        },
      });
    }
  }

  return { dbUser, clerkRole };
}
