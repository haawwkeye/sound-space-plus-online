import { requireRole } from "$lib/util";
import { moderateUser, resolveModeration } from "$lib/moderation";
import { json, type RequestHandler } from "@sveltejs/kit";

function convertToDate(date: string | null) : Date | undefined
{
    if (date == null) return undefined;
    return new Date(date)
}

export const GET: RequestHandler = async (event) => {
    requireRole(event, 1)

    var idString = event.url.searchParams.get("id") ?? -1
    var resolve = event.url.searchParams.get("resolve") == "true" ?? false
    var typeString = event.url.searchParams.get("type") ?? -1
    var reason = event.url.searchParams.get("reason") ?? undefined
    var date = convertToDate(event.url.searchParams.get("date"))

	var id = Number(idString)
    var type = Number(typeString)
    var res;

    if (id == -1 || (resolve == false && type == -1)) return json({message: "UserId/ModerationType required!"});

    if (!resolve) res = await moderateUser(event.locals.user, id, type, reason, date);
    else res = await resolveModeration(event.locals.user, id);

    if (res == null) res = [false, "Unknown Error"];

	return json(res)
}
