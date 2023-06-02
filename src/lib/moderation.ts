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

export async function resolveModeration(adminUser: App.Locals["user"], caseId: number) {
    // TODO: do some checks to see if the id exists tho this might just error if it doesn't
    try {
        await prisma.moderation.update({
            where: {
                id: caseId
            },
            data: {
                resolved: true,
                dateResolved: new Date(Date.now())
            }
        })
    } catch {
        return [false, "Case doesn't exist or database error"]
    }
    
    return [true]
}

export async function moderateUser(adminUser: App.Locals["user"], userId: number, type: number, reason: string | undefined, expiresAt: Date | undefined) {
	var victim = await prisma.user.findUnique({
		where: {
			id: userId
		},
		select: {
			id: true,
			role: true,
			verified: true
		}
	})

    var _type: string = getModerationType(type);

	if (victim == null) return [false, `${userId} doesn't exist`]
    if (_type == null) return [false, "Moderation type doesn't exist"]
	if (victim.id == adminUser.id) return [false, "Cannot moderate yourself"]
	if (victim.role <= adminUser.role) return [false, `Cannot moderate ${userId} same role or higher`]

    // TODO: do this but better Lol
    var modType: ModerationType = ModerationType.WARN;
    if (_type == "NAME") modType = ModerationType.NAME;
    else if (_type == "BAN") modType = ModerationType.BAN;

	var moderationCase = await prisma.moderation.create({
        data: {
            userId: victim.id,
            adminId: adminUser.id,
            type: modType,
            reason: reason,
            expiresAt: expiresAt,
            dateCreated: new Date(Date.now())
        }
    })

    return [true, moderationCase]
}
