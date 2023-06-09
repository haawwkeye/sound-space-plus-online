import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ setHeaders }) => {
	setHeaders({
		"Cross-Origin-Opener-Policy": "same-origin",
		"Cross-Origin-Embedder-Policy": "require-corp"
	})
}