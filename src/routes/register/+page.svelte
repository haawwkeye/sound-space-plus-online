<script lang="ts">
	import Title from "../Title.svelte";
	import { goto, invalidateAll } from "$app/navigation";

	export let form: any;

	async function attemptLogin(event: Event) {
		const data = new FormData(event.target as HTMLFormElement);
		if (
			data.get("password")?.toString() !=
			data.get("password2")?.toString()
		) {
			form = { success: false, message: "Passwords must be the same!" };
			return;
		}

		const response = await fetch("/api/auth/register", {
			method: "POST",
			body: data,
		});
		const responseData = await response.json();

		form = responseData;

		await invalidateAll();

		if (responseData.success) goto("/");
	}
</script>

<Title title="Register" />
<section>
	<form on:submit|preventDefault={attemptLogin} class="login" id="form">
		<h2>Register</h2>
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
		<input
			type="password"
			name="password2"
			placeholder="Confirm Password"
			id="password2"
			class="text"
			required
		/>
		<br />
		<input type="submit" value="Register" />
		{#if form && !form.success}
			<p>{form?.message}</p>
		{/if}
	</form>
</section>
