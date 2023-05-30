import type { RequestEvent } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import prisma from "$lib/prisma";

export const RoleMap: any = {
	"USER": 0,
	"MOD": 1,
	"ADMIN": 2
}

export function requireAuth(event: RequestEvent) {
	var { user } = event.locals
	if (!user) throw error(403)
	return user
}
export function requireRole(event: RequestEvent, role: number) {
	var user = requireAuth(event)
	if ((RoleMap[user.role] ?? 0) < role) throw error(403)
}

export async function usernameAvailable(name: string) {
	var existing = await prisma.user.findFirst({
		where: {
			name: {
				equals: name,
				mode: "insensitive"
			}
		}
	})
	if (existing) return false
	return true
}
export function usernameValid(name: string) {
	var valid = /^[^\s][\p{L}\p{Lo}\p{N}\p{S}\p{P}\p{Zs}]+[^\s]$/iu
	return valid.test(name)
}
export function usernameAppropriate(name: string) {
	var nword = /n(i|1|l)(gg{1,})(a|e)?r?s?/gi
	return !nword.test(name)
}

export async function identifyAlts(userId: number) {
	var ips: Array<string> = []
	var sessions = await prisma.session.findMany({
		where: {
			userId: userId
		},
		select: {
			ip: true
		}
	})
	sessions.forEach(session => {
		if (!session.ip) return;
		if (!(session.ip in ips)) ips.push(session.ip)
	});
	var otherSessions = await prisma.session.findMany({
		where: {
			ip: {
				in: ips
			},
			userId: {
				not: userId
			}
		},
		select: {
			user: true
		}
	})
	return otherSessions.map(session => session.user)
}