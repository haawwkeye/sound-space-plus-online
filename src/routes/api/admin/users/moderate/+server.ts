import { identifyAlts, requireRole } from "$lib/util";
import { ModerateUser } from "$lib/moderation";
import { json, type RequestHandler } from "@sveltejs/kit";

function convertToDate(date: string | null) : Date | undefined
{
    if (date == null) return undefined;
    return new Date(date)
}

export const GET: RequestHandler = async (event) => {
    requireRole(event, 1)

    var idString = event.url.searchParams.get("id") ?? -1
    var typeString = event.url.searchParams.get("type") ?? -1
    var reason = event.url.searchParams.get("reason") ?? undefined
    var date = convertToDate(event.url.searchParams.get("date"))

	var id = Number(idString)
    var type = Number(typeString)

    if (id == -1 || type == -1) return json({message: "UserId/ModerationType required!"});

    var moderated = await ModerateUser(event.locals.user, id, type, reason, date);
    if (moderated == null) moderated = {success: false, message: "Unknown Status"}

	return json(moderated)
}
