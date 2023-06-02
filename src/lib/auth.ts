import prisma from "$lib/prisma";
import type { RequestEvent } from "@sveltejs/kit";
import type { User } from "@prisma/client";
import * as bcrypt from "bcrypt"
import * as crypto from "crypto"
import { usernameAppropriate, usernameAvailable, usernameValid } from "$lib/util";
import check_many_cidrs from "ip-range-check";

var blacklistedRanges: Array<string>
var lastBlacklistUpdate: number = 0
var blacklistUpdateFrequency = 86400000

export async function updateBlacklistedRanges() {
	lastBlacklistUpdate = Date.now()
	var result = await fetch("https://raw.githubusercontent.com/X4BNet/lists_vpn/main/output/datacenter/ipv4.txt")
	var text = await result.text()
	var list = text.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/)
	blacklistedRanges = list
}
export async function ipInBlacklistedRanges(ip: string) {
	//if (!blacklistedRanges || Date.now() - lastBlacklistUpdate > blacklistUpdateFrequency) await updateBlacklistedRanges();
	//return check_many_cidrs(ip, blacklistedRanges)
	return false
}

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

export async function attachUserToRequest(sessionId: string, sessionToken: string, event: RequestEvent) {
	var session = await prisma.session.findFirst({
		where: {
			id: sessionId,
			invalid: false
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
		await prisma.session.update({
			where: {
				id: session.id
			},
			data: {
				invalid: true
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

export async function encryptPassword(plain: string) {
	return await bcrypt.hash(plain, 8)
}
export async function createAccount(name: string, pass: string, ip?: string, location?: string) {
	if (name.length > 24 || name.length < 3) return [false, "Username must be between 3-24 characters"]

	var valid = usernameValid(name)
	if (!valid) return [false, "Username contains invalid characters"]

	var appropriate = usernameAppropriate(name);
	if (!appropriate) return [false, "Username is not appropriate"]

	var available = await usernameAvailable(name);
	if (!available) return [false, "Username is already taken"]

	if (pass.length < 8) return [false, "Password must be 8 characters or more"]

	var user = await prisma.user.create(
		{
			data: {
				name: name,
				pass: await encryptPassword(pass),
				registerIp: ip,
				registerLocation: location
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