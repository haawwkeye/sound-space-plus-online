<script lang="ts">
	import Title from "../Title.svelte";
	import { page } from "$app/stores";

	function formatDate(date: Date) {
		return new Date(date).toUTCString();
	}
</script>

<Title title="Users" />
<h2>Users</h2>
<p>{$page.data.count} total users</p>
<div class="paginator">
	<span>{$page.data.currentPage}/{$page.data.noPages} pages</span>
	<br />
	<a href="?pg=1"> &lt;&lt;</a>
	<a href="?pg={Math.max($page.data.currentPage - 1, 1)}"> &lt;</a>
	<a href="?pg={Math.min($page.data.currentPage + 1, $page.data.noPages)}">
		&gt;</a
	>
	<a href="?pg={$page.data.noPages}"> &gt;&gt;</a>
</div>
<ul>
	{#each $page.data.list as user}
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
<p>{$page.data.count} total users</p>
<div class="paginator">
	<span>{$page.data.currentPage}/{$page.data.noPages} pages</span>
	<br />
	<a href="?pg=1"> &lt;&lt;</a>
	<a href="?pg={Math.max($page.data.currentPage - 1, 1)}"> &lt;</a>
	<a href="?pg={Math.min($page.data.currentPage + 1, $page.data.noPages)}">
		&gt;</a
	>
	<a href="?pg={$page.data.noPages}"> &gt;&gt;</a>
</div>

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
