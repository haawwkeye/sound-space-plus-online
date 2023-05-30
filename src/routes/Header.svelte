<script>
	import { getContext } from "svelte";

	const user = getContext("user");
</script>

<header>
	<h1>Sound Space Plus</h1>
	<nav>
		<ul>
			<li><a href="/">Home</a></li>
			<li><a href="/users">Users</a></li>
			{#if $user}
				{#if $user.role != "USER"}<li>
						<a href="/admin">Admin Panel</a>
					</li>{/if}
				<li class="right"><a href="/u/{$user.id}">{$user.name}</a></li>
			{:else}
				<li class="right"><a href="/register">Register</a></li>
				<li class="right"><a href="/login">Login</a></li>
			{/if}
		</ul>
	</nav>
</header>

<style>
	header {
		background-color: var(--color-bg-1);
		display: box;
		justify-content: space-between;
		text-align: center;
		color: white;
	}

	nav {
		display: box;
		background-color: var(--color-bg-0);
		justify-content: center;
	}

	h1 {
		margin: 0;
		padding: 1rem;
		text-align: center;
	}

	ul {
		padding: 0.5em;
		margin: auto;
		max-width: 48rem;
		height: 1em;
		list-style: none;
	}

	li {
		display: inline;
		float: left;
		height: 100%;
		margin-left: 1rem;
	}

	li.right {
		float: right;
	}
</style>
