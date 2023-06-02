import prisma from "$lib/prisma";
import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	var id = event.url.searchParams.get("id")
	var search: any = {
		id: Number(id ?? 0)
	}
	var name = event.url.searchParams.get("name")
	if (name && !id)
		search = {
			name: {
				equals: name,
				mode: "insensitive"
			}
		}
	var user = await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			avatar: true,
			verified: true,
			dateCreated: true,
			role: true
		},
		where: search
	})
	if (!user)
		throw error(404)
	return json(user)
}