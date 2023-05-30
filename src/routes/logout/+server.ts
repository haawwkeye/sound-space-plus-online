import { redirect, type RequestHandler } from "@sveltejs/kit";
import { POST } from "../api/auth/logout/+server";

export const GET: RequestHandler = async (event) => {
	await POST(event)
	throw redirect(302, "/")
}