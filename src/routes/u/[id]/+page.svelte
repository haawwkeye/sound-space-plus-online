<script lang="ts">
	import { getContext } from 'svelte';
	import Title from "../../Title.svelte";
	import type { PageServerData } from "./$types";

	type User = {
		id: number;
		name: string;
		avatar?: string;
		verified: boolean;
		role: string;
		dateCreated: Date;
	};

	export let data: PageServerData;

	const user = data.user;
	const client: any = getContext("user");
</script>

<sveltekit:head>
	<meta property="og:title" content={user.name} />
</sveltekit:head>

<Title title={user.name} />
<h2>{user.name}</h2>
{#if client.role != "USER"} <span><a href="/admin?id={user.id}&tab=4">Moderate User</a></span><br> {/if}
{#if user.verified} <span>This user is verified</span><br /> {/if}
{#if user.role == "MOD"} <span>This user is a mod</span><br /> {/if}
{#if user.role == "ADMIN"} <span>This user is an admin</span><br /> {/if}
