import prisma from "$lib/prisma";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	var id = Number(params.id ?? 0);
	var user = await prisma.user.findUnique({
		where: {
			id: id
		}
	})
	if (!user) throw error(404)
	return { user: user }
}
export const prerender = true;