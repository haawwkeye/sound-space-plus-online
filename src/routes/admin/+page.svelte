<script lang="ts">
	import Title from "../Title.svelte";

	var user: any;
	var sessions: Array<any>;

	async function findUser() {
		var element = document.getElementById("uid") as HTMLInputElement;
		var id = element.value;
		var result = await fetch(`/api/users/profile?id=${id}`);
		if (result.ok) user = await result.json();
	}
</script>

<Title title="Admin Panel" />
<h2>Admin Panel</h2>
<form>
	<input type="number" name="uid" id="uid" placeholder="User ID" />
	<input type="button" value="Select" on:click={findUser} />
</form>

{#if user}
	<p>{user.name}</p>
{:else}
	<p>No user selected</p>
{/if}

<style>
	input {
		display: inline;
		width: fit-content;
	}
</style>
