<script lang="ts">
	import { onMount } from "svelte";

	type User = {
		id: number;
		name: string;
		avatar?: string;
		verified?: boolean;
		dateCreated?: Date;
	};

	let list: Array<User> = [];
	let noPages: number = 0;
	async function getUsers(page: number, search?: string) {
		var result = await fetch(
			`/api/users/list?page=${page}&search=${search}`
		);
		if (!result.ok) return;
		var json = await result.json();
		list = json.users;
		noPages = json.pages;
	}

	function formatDate(date:Date) {
		return new Date(date).toUTCString()
	}

	onMount(() => {
		getUsers(0);
	});
</script>

<h2>Users</h2>
<ul>
	{#each list as user}
		<li class="user">
			<p class="name">
				<a href="/u/{user.id}">
					{user.name}
				</a>
			</p>
			<p>{formatDate(user.dateCreated)}</p>
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
	}
	.user {
		padding: 0.5em 2em;
		background-color: var(--color-bg-1);
	}
	.user .name {
		font-size: 1.2em;
	}
	.user .name a {
		text-decoration: none;
	}
</style>
