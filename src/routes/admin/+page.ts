import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url }) => {
	let currentUser = Number(url.searchParams.get("id") ?? 0);
    let currentTab = Number(url.searchParams.get("tab") ?? 0);

	return {
		currentUser,
        currentTab
	}
}