<script lang="ts">
	import Title from "../Title.svelte";

	var userId: number;
	var userName: string = "";

	var user: any;
	var sessions: Array<any>;

	async function findUserId() {
		var element = document.getElementById("uid") as HTMLInputElement;
		var id = element.value;
		var result = await fetch(`/api/users/profile?id=${id}`);
		if (result.ok) user = await result.json();
		userName = user.name;
	}
	async function findUserName() {
		var element = document.getElementById("name") as HTMLInputElement;
		var name = element.value;
		var result = await fetch(`/api/users/profile?name=${name}`);
		if (result.ok) user = await result.json();
		userId = user.id;
	}
</script>

<Title title="Admin Panel" />
<h2>Admin Panel</h2>
<form>
	<input
		type="number"
		name="uid"
		id="uid"
		placeholder="User ID"
		value={userId}
	/>
	<input type="button" value="Select" on:click={findUserId} />
	<br />
	<input
		type="text"
		name="name"
		id="name"
		placeholder="User Name"
		value={userName}
	/>
	<input type="button" value="Find" on:click={findUserName} />
</form>

<style>
	form {
		text-align: left;
	}
	input {
		display: inline;
		min-width: 4em;
	}
</style>
