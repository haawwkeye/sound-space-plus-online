import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	var id = Number(event.url.searchParams.get("id") ?? 0)
	var user = await prisma.user.findUnique({
		select: {
			id: true,
			name: true,
			avatar: true,
			verified: true,
			dateCreated: true
		},
		where: {
			id: id
		}
	})
	return json(user)
}