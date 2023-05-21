import { applyNewSession, createAccount } from "$lib/auth";
import prisma from "$lib/prisma";
import type { User } from "@prisma/client";
import type { RequestHandler } from "@sveltejs/kit";
import { json, error } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
	if (event.locals.user) throw error(403)

	const form = await event.request.formData()
	var username = form?.get("username")
	var password = form?.get("password")
	if (!(username && password)) throw error(400)



	var status = await createAccount(username.toString(), password.toString())
	if (status[0])
		await applyNewSession(status[1] as User, event)

	return json({
		success: status[0],
		message: status[0] ? "Success" : status[1]
	})
}