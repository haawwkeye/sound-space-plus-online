import prisma from "$lib/prisma";
import { ModerationType } from "@prisma/client";

export const ModerationTypeMap: any = {
    0: "NAME",
    1: "WARN",
    2: "BAN",
}

function getModerationType(type: number)
{
    return ModerationTypeMap[type] ?? null
}

export async function moderateUser(adminUser: App.Locals["user"], userId: number, type: number, reason: string | undefined, expiresAt: Date | undefined) {
	var moderatedUser = await prisma.user.findUnique({
		where: {
			id: userId
		},
		select: {
			// name: true,
			// avatar: true,
			// dateCreated: true,
			id: true,
			role: true,
			verified: true
		}
	})

    var _type: string = getModerationType(type);

	if (moderatedUser == null) return {success: false, message: `${userId} doesn't exist`}
    if (_type == null) return {success: false, message: "Moderation type doesn't exist"}
	if (moderatedUser.id == adminUser.id) return {success: false, message: "Cannot moderate yourself"}
	if (moderatedUser.role <= adminUser.role) return {success: false, message: `Cannot moderate ${userId} same role or higher`}

    // TODO: do this but better Lol
    var modType: ModerationType = ModerationType.WARN;
    if (_type == "NAME") modType = ModerationType.NAME;
    else if (_type == "BAN") modType = ModerationType.BAN;

	var moderationCase = await prisma.moderation.create({
        data: {
            userId: moderatedUser.id,
            adminId: adminUser.id,
            type: modType,
            reason: reason,
            expiresAt: expiresAt,
            dateCreated: new Date(Date.now())
        }
    })

    return {success: true, caseId: moderationCase}
}
