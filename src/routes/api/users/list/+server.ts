import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const pagesize = 16

export const GET: RequestHandler = async (event) => {
	var page = Number(event.url.searchParams.get("page") ?? 0)
	var search = event.url.searchParams.get("search")

	var total = await prisma.user.count()
	var list = await prisma.user.findMany({
		where: {
			moderations: {
				none: {
					NOT: {
						type: "WARN"
					},
					resolved: false
				}
			}
		},
		select: {
			id: true,
			name: true,
			avatar: true,
			verified: true,
			dateCreated: true,
			role: true
		},
		orderBy: {
			dateCreated: "desc"
		},
		take: pagesize,
		skip: page * pagesize
	})
	return json({ users: list, count: total, pages: Math.ceil(total / pagesize) })
}