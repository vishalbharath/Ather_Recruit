import { currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";
import { OrgRole } from "@prisma/client";

export async function checkAndSyncUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    return null;
  }

  const name =
    `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
    "User";

  const avatarUrl = clerkUser.imageUrl;

  const clerkRole =
    (clerkUser.publicMetadata?.role as OrgRole) ||
    OrgRole.RECRUITER;

  // Create or update user safely
  let dbUser = await prisma.user.upsert({
    where: {
      clerkId: clerkUser.id,
    },
    update: {
      email,
      name,
      avatarUrl,
    },
    create: {
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

  // First login: create default workspace if user has none
  if (dbUser.memberships.length === 0) {
    const defaultOrgSlug = `org-${clerkUser.id
      .substring(5, 13)
      .toLowerCase()}`;

    // Check if organization already exists
    let organization = await prisma.organization.findUnique({
      where: {
        slug: defaultOrgSlug,
      },
    });

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: `${clerkUser.firstName ?? "Aether"}'s Workspace`,
          slug: defaultOrgSlug,
        },
      });
    }

    // Check if membership already exists
    const membership = await prisma.membership.findFirst({
      where: {
        userId: dbUser.id,
        organizationId: organization.id,
      },
    });

    if (!membership) {
      await prisma.membership.create({
        data: {
          userId: dbUser.id,
          organizationId: organization.id,
          role: OrgRole.OWNER,
        },
      });
    }

    // Reload user with memberships
    dbUser = await prisma.user.findUnique({
      where: {
        id: dbUser.id,
      },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    }) as typeof dbUser;
  }

  return {
    dbUser,
    clerkRole,
  };
}