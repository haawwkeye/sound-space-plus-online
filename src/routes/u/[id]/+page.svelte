<script lang="ts">
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
</script>

<sveltekit:head>
	<meta property="og:title" content={user.name} />
</sveltekit:head>

<Title title={user.name} />
<h2>{user.name}</h2>
{#if user.verified} <span>This user is verified</span><br /> {/if}
{#if user.role == "ADMIN"} <span>This user is an admin</span><br /> {/if}
