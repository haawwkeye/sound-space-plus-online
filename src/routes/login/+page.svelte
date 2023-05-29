<script lang="ts">
	import Title from "../Title.svelte";
	import { goto, invalidateAll } from "$app/navigation";

	export let form: any;

	async function attemptLogin(event: Event) {
		const data = new FormData(event.target as HTMLFormElement);
		const response = await fetch("/api/auth/login", {
			method: "POST",
			body: data,
		});
		const responseData = await response.json();

		form = responseData;

		await invalidateAll();

		if (responseData.success) goto("/");
	}
</script>

<Title title="Login" />
<section>
	<form on:submit|preventDefault={attemptLogin} class="login" id="form">
		<h2>Login</h2>
		<input
			type="text"
			name="username"
			placeholder="Username"
			id="username"
			class="text"
			required
			minlength="3"
			maxlength="24"
		/>
		<br />
		<input
			type="password"
			name="password"
			placeholder="Password"
			id="password"
			class="text"
			required
		/>
		<br />
		<input type="submit" value="Login" />
		{#if form && !form.success}
			<p>{form?.message}</p>
		{/if}
	</form>
</section>
