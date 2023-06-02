import prisma from "$lib/prisma";
import { identifyAlts, requireRole } from "$lib/util";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event) => {
    requireRole(event, 1)

    var id = Number(event.url.searchParams.get("id") ?? 0);
    var caseId = Number(event.params.caseId ?? 0);
	var moderationCase
    // TODO: Look into better ways of doing this
    if (id != 0)
    {
        var user = await prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                moderations: true
            }
        })

        if (caseId != 0) moderationCase = user?.moderations[caseId-1]
        else moderationCase = user?.moderations
    }
    else if (caseId == 0)
    {
        moderationCase = await prisma.moderation.findMany();
    } else {
        moderationCase = await prisma.moderation.findUnique({
            where: {
                id: caseId
            },
        })
    }

	return json(moderationCase)
}
