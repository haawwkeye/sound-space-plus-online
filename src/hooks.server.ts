import type { Handle, HandleServerError, RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import * as crypto from "crypto";

async function attachUserToRequest(sessionId: string, sessionToken: string, event: RequestEvent) {
	var session = await prisma.session.findUnique({
		where: {
			id: sessionId
		}
	})
	if (!session) return

	var hash = crypto.createHash("md5")
	hash.update(sessionToken)
	var clientToken = hash.digest("hex")
	var serverToken = session.cookie
	if (clientToken != serverToken) return

	var userAgent = event.request.headers.get("User-Agent") ?? "N/A"
	var ip = event.request.headers.get("CF-Connecting-IP") ?? event.request.headers.get("X-Real-IP") ?? event.getClientAddress()
	var location = event.request.headers.get("CF-IPCountry") ?? "N/A"
	if (userAgent != session.userAgent) {
		await prisma.session.delete({
			where: {
				id: session.id
			}
		})
		return
	}

	var user = await prisma.user.findUnique({
		where: {
			id: session.userId
		},
		select: {
			name: true,
			avatar: true,
			dateCreated: true,
			id: true,
			role: true,
			verified: true
		}
	})
	if (!user) return

	session = await prisma.session.update({
		where: {
			id: session.id
		},
		data: {
			lastAccessed: new Date(Date.now()),
			ip: ip,
			location: location
		}
	})
	event.locals.user = user
	event.locals.session = session
}

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