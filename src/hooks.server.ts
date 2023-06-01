import type { Handle, HandleServerError, RequestEvent } from "@sveltejs/kit";
import { attachUserToRequest } from "$lib/auth";

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies } = event
	const sessionId = cookies.get("ss+sid")
	const sessionToken = cookies.get("ss+tkn")
	if (sessionId && sessionToken) await attachUserToRequest(sessionId, sessionToken, event)

	if (!event.locals.user) {
		cookies.delete("ss+sid")
		cookies.delete("ss+tkn")
	}

	const response = await resolve(event)
	return response
}
export const handleError: HandleServerError = async () => {
	return { message: "" }
}