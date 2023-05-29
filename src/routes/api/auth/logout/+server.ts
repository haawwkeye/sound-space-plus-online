import prisma from "$lib/prisma";
import type { RequestHandler } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) throw error(403)
	await prisma.session.delete({
		where: {
			id: event.locals.session.id
		}
	})
	return json({ success: true })
}