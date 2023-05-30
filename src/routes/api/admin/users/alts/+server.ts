import { identifyAlts, requireRole } from "$lib/util";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event) => {
	requireRole(event, 1)

	var id = Number(event.url.searchParams.get("id") ?? 0)
	var alts = identifyAlts(id)
	return json(alts)
}