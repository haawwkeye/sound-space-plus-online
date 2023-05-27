import prisma from "$lib/prisma";
import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	var id = Number(event.url.searchParams.get("id") ?? 0)
	var user = await prisma.user.findUnique({
		select: {
			id: true,
			name: true,
			avatar: true,
			verified: true,
			dateCreated: true,
			role: true
		},
		where: {
			id: id
		}
	})
	if (!user)
		throw error(404)
	return json(user)
}