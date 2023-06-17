import { promises } from "fs";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event) => {
	var response = new Response(
		await promises.readFile(`static/_demo/${event.params.file}`)
	)
	var extension = event.params.file?.split(".").pop()
	var mime = `text/${extension}`
	if (extension == "js")
		mime = "application/javascript"
	response.headers.append("Content-Type", mime)
	// response.headers.append("Cross-Origin-Opener-Policy", "same-origin")
	response.headers.append("Cross-Origin-Embedder-Policy", "credentialless")
	return response
}