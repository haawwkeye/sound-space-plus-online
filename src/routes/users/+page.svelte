<script lang="ts">
	import Title from "../Title.svelte";
	import { page } from "$app/stores";
	import { onMount } from "svelte";

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

	let currentPage = Number($page.url.searchParams.get("pg") ?? 0);
	function nextPage() {
		currentPage = Math.min(currentPage + 1, noPages - 1);
		getUsers(currentPage);
	}
	function prevPage() {
		currentPage = Math.max(currentPage - 1, 0);
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
		getUsers(currentPage);
	});
</script>

<Title title="Users" />
<h2>Users</h2>
<div class="paginator">
	<span>{currentPage + 1}/{noPages} pages</span>
	<br />
	<a on:click={firstPage} href="?pg=0"> &lt;&lt;</a>
	<a on:click={prevPage} href="?pg={Math.max(currentPage - 1, 0)}"> &lt;</a>
	<a on:click={nextPage} href="?pg={Math.min(currentPage + 1, noPages - 1)}">
		&gt;</a
	>
	<a on:click={lastPage} href="?pg={noPages - 1}"> &gt;&gt;</a>
</div>
<ul>
	{#each list as user}
		<li class="user">
			<p class="name">
				<a href="/u/{user.id}">
					{user.name}
				</a>
				{#if user.verified}
					<span>&#10004;</span>
				{/if}
				<span>{user.role}</span>
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
