<script>
	import { getContext } from "svelte";

	const user = getContext("user");
</script>

<header>
	<h1>Sound Space Plus</h1>
	<nav>
		<ul>
			{#if $user}
				<li class="right">{$user.name}</li>
			{:else}
				<li class="right"><a href="register">Register</a></li>
				<li class="right"><a href="login">Login</a></li>
			{/if}
			<li><a href="/">Home</a></li>
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
		margin-bottom: 1em;
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
