import prisma from "$lib/prisma";
import type { RequestEvent } from "@sveltejs/kit";
import type { User } from "@prisma/client";
import * as bcrypt from "bcrypt"
import * as crypto from "crypto"

export async function comparePasswords(plain: string, encrypted: string) {
	return await bcrypt.compare(plain, encrypted)
}
export async function applyNewSession(user: User, event: RequestEvent) {
	var sessionToken = crypto.randomBytes(32).toString("hex")
	var hash = crypto.createHash("md5")
	hash.update(sessionToken)
	var hashedToken = hash.digest("hex")
	var session = await prisma.session.create({
		data: {
			userId: user.id,
			cookie: hashedToken,
			userAgent: event.request.headers.get("User-Agent") ?? "N/A"
		}
	})
	event.cookies.set("ss+sid", session.id, { maxAge: 31536000, path: "/", sameSite: "lax" }) // One Year
	event.cookies.set("ss+tkn", sessionToken, { maxAge: 31536000, path: "/", sameSite: "lax" })
}

export async function encryptPassword(plain: string) {
	return await bcrypt.hash(plain, 8)
}
export async function createAccount(name: string, pass: string) {
	if (name.trim() != name) return [false, "Username cannot start or end with whitespace"]
	if (name.length > 24 || name.length < 3) return [false, "Username must be between 3-20 characters"]

	var existing = await prisma.user.findFirst({
		where: {
			name: {
				equals: name,
				mode: "insensitive"
			}
		}
	})
	if (existing) return [false, "Username is already taken"]

	if (pass.length < 8) return [false, "Password must be 8 characters or more"]

	var user = await prisma.user.create(
		{
			data: {
				name: name,
				pass: await encryptPassword(pass)
			}
		}
	)
	return [true, user]
}

export async function cleanSessions() {
	prisma.session.deleteMany(
		{
			where: {
				"lastAccessed": {
					gt: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)) // One Month
				}
			}
		}
	)
}
setInterval(cleanSessions, 1000 * 60 * 60) // One Hour