import prisma from "$lib/prisma";
import { requireAuth, requireRole } from "$lib/util";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async (event) => {
	requireAuth(event)
	var idString = event.url.searchParams.get("id")
	if (idString) requireRole(event, 2)
	var id = Number(idString ?? event.locals.user.id)

	var sessions = await prisma.session.findMany({
		where: {
			userId: id
		},
		select: {
			id: true,
			ip: true,
			userAgent: true,
			location: true,
			lastAccessed: true
		}
	})
	return json(sessions)
}