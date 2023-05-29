<script lang="ts">
	import Title from "../../Title.svelte";
	import { page } from "$app/stores";
	import type internal from "stream";
	import { onMount } from "svelte";

	type User = {
		id: number;
		name: string;
		avatar?: string;
		verified: boolean;
		role: string;
		dateCreated: Date;
	};
	let user: User;
	let userExists: boolean = true;

	async function getUser() {
		var id = $page.params.id;
		var result = await fetch(`/api/users/profile?id=${id}`);
		if (!result.ok) {
			userExists = false;
			return;
		}
		user = await result.json();
	}
	onMount(getUser);
</script>

{#if !userExists}
	<h1>404</h1>
	<h2>This user doesn't exist</h2>
{:else if user != null}
	<Title title={user.name} />
	<h2>{user.name}</h2>
	{#if user.verified} <span>This user is verified</span><br /> {/if}
	{#if user.role == "ADMIN"} <span>This user is an admin</span><br /> {/if}
{/if}
