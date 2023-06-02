import type { Handle, HandleServerError, RequestEvent } from "@sveltejs/kit";
import { attachUserToRequest } from "$lib/auth";

export const handle: Handle = async ({ event, resolve }) => {
	console.log("----" + event.url.pathname)
	console.log("attempting auth")
	const { cookies } = event
	const sessionId = cookies.get("ss+sid")
	const sessionToken = cookies.get("ss+tkn")
	if (sessionId && sessionToken) await attachUserToRequest(sessionId, sessionToken, event)

	if ((sessionId || sessionToken) && !event.locals.user) {
		cookies.delete("ss+sid")
		cookies.delete("ss+tkn")
		console.log(`auth failed for sid ${sessionId}`)
	}

	const response = await resolve(event)
	console.log("----")
	return response
}
export const handleError: HandleServerError = async () => {
	return { message: "" }
}