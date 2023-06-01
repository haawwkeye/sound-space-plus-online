import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url }) => {
	type User = {
		id: number;
		name: string;
		avatar?: string;
		verified: boolean;
		dateCreated: Date;
		role: string;
	};

	let list: Array<User> = [];
	let noPages: number = 0;
	let count: number = 0;

	async function getUsers(page: number, search?: string) {
		var result = await fetch(
			`/api/users/list?page=${page}&search=${search}`
		);
		if (!result.ok) return;
		var json = await result.json();
		list = json.users;
		count = json.count;
		noPages = json.pages;
	}

	let currentPage = Number(url.searchParams.get("pg") ?? 1);
	await getUsers(currentPage - 1)
	return {
		list,
		currentPage,
		count,
		noPages
	}
}