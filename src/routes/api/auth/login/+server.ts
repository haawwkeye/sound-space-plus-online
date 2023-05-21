import { comparePasswords, applyNewSession } from "$lib/auth";
import prisma from "$lib/prisma";
import type { RequestHandler } from "@sveltejs/kit";
import { json, error } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
	if (event.locals.user) throw error(403)

	const form = await event.request.formData()
	var username = form?.get("username")
	var password = form?.get("password")
	if (!(username && password)) throw error(400)

	const user = await prisma.user.findFirst({
		where: {
			name: {
				equals: username.toString(),
				mode: "insensitive"
			}
		}
	})

	var success = false
	if (user && user.pass) {
		success = await comparePasswords(password.toString(), user.pass)
		if (success)
			await applyNewSession(user, event)
	}

	return json({
		success: success,
		message: success ? "Success" : "Username or password is incorrect"
	})
}