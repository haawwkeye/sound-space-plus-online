<script lang="ts">
	import { onMount } from "svelte";

	type User = {
		id: number;
		name: string;
		avatar?: string;
		verified: boolean;
		dateCreated: Date;
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

	let currentPage = 0;
	function nextPage() {
		currentPage = Math.min(currentPage + 1, noPages - 1);
		getUsers(currentPage);
	}
	function prevPage() {
		currentPage = Math.max(currentPage - 1, noPages - 1);
		getUsers(currentPage);
	}
	function lastPage() {
		currentPage = noPages - 1;
		getUsers(currentPage);
	}
	function firstPage() {
		currentPage = 0;
		getUsers(currentPage);
	}

	function formatDate(date: Date) {
		return new Date(date).toUTCString();
	}

	onMount(() => {
		getUsers(0);
	});
</script>

<h2>Users</h2>
<div class="paginator">
	<span>{currentPage + 1}/{noPages} pages</span>
	<br />
	<a on:click={firstPage}>&lt;&lt;</a>
	<a on:click={prevPage}>&lt;</a>
	<a on:click={nextPage}>&gt;</a>
	<a on:click={lastPage}>&gt;&gt;</a>
</div>
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
<p>{count} total users</p>

<style>
	.paginator {
		text-align: center;
	}
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
