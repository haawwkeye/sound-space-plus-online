import prisma from "$lib/prisma";
import type { RequestHandler } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) throw error(403)
	await prisma.session.update({
		where: {
			id: event.locals.session.id
		},
		data: {
			invalid: true
		}
	})
	event.cookies.delete("ss+sid")
	event.cookies.delete("ss+tkn")
	event.locals.session = null
	event.locals.user = null
	return json({ success: true })
}