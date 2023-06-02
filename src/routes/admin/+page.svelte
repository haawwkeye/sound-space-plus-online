<script lang="ts">
	import { getContext } from 'svelte';
	import Title from "../Title.svelte";

	const admin: any = getContext("user");

	export let moderateRes: any;
	var moderationType: number;

	var userId: number;
	var userName: string = "";

	var user: any;
	var sessions: Array<any>;
	var moderations: Array<any>;
	var nameHistory: String[];
	
	var currentTab: string = "none";

	// Reset the data provided ig /shrug
	function resetUserData() {
		// All of these are in a try catch func because sometimes it will error even tho it shouldn't
		try {
			nameHistory?.pop();
		} catch { }
		try {
			moderations?.pop();
		} catch { }
		try {
			sessions?.pop();
		} catch { }

		changeOption("none"); // Reset the option back to none
	}

	async function findUserId() {
		resetUserData();

		var element = document.getElementById("uid") as HTMLInputElement;
		var id = element.value;
		var result = await fetch(`/api/users/profile?id=${id}`);
		if (result.ok) user = await result.json();
		userName = user?.name ?? "N/A";
	}
	async function findUserName() {
		resetUserData();

		var element = document.getElementById("name") as HTMLInputElement;
		var name = element.value;
		var result = await fetch(`/api/users/profile?name=${name}`);
		if (result.ok) user = await result.json();
		userId = user?.id ?? "N/A";
	}

	// TODO: Change the 3 functions here to be better
	async function getSessions() {
		if (!user) return;
		var result = await fetch(`/api/admin/users/sessions?id=${user.id}`);

		if (result.ok) sessions = await result.json();
	}
	
	async function getModerations() {
		if (!user) return;
		// var result = await fetch(`/api/admin/users/cases?id=${user.id}`);

		// if (result.ok) moderations = await result.json();
	}

	async function getNameHistory() {
		if (!user) return;
		// var result = await fetch(`/api/admin/users/names?id=${user.id}`);

		// if (result.ok) nameHistory = await result.json();
	}
	// 

	var change_cooldown = false; // Debounce for changing options

	async function changeOption(opt: string)
	{
		if (currentTab == "loading") return;
		if (currentTab == opt) return;
		if (change_cooldown) return;
		change_cooldown = true;

		var element = document.getElementById(`${opt}Btn`) as HTMLElement;
		var selected = document.getElementsByClassName('adminSelected') as HTMLCollectionOf<Element>;

		console.log(element, selected)

		if (element != undefined) setTimeout(() => { element.classList.add('adminSelected'); }, 100);
		if (selected[0] != undefined) selected[0].classList.remove('adminSelected');

		currentTab = "loading";

		if (opt == "sessions") await getSessions();
		else if (opt == "moderationHistory") await getModerations();
		else if (opt == "nameHistory") await getNameHistory();
		else if (opt == "moderateUser")
		{
			moderationType = 1;
		}

		currentTab = opt;
		setTimeout(() => { change_cooldown = false; }, 150)
	}

	function moderationTypeChange()
	{
		var type = document.getElementById("type") as HTMLInputElement;
		moderationType = Number(type.value) ?? 1;
	}

	// TODO: Add moderation stuff to users
	async function moderateUser()
	{
		if (!user) return;
	}

	function resolveModeration(caseId: number)
	{

	}

	const formatDate = (date: Date) => {
		var format = new Intl.DateTimeFormat(undefined, {
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		}).format(date);

		return format.toString()
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

{#if user}
	<h2>{user.name}</h2>
	<div id="userOptionsContainer">
		<hr>
		<div id="userButtonContainer">
			<button style="display: none;" class="adminSelected">Style</button>
			<button id="nameHistoryBtn" on:click={() => changeOption("nameHistory")}>Name History</button>
			<button id="moderationHistoryBtn" on:click={() => changeOption("moderationHistory")}>Moderation History</button>
			{#if $admin.role == "ADMIN"}
				<button id="sessionsBtn" on:click={() => changeOption("sessions")}>Sessions</button>
			{/if}
			<button id="moderateUserBtn" on:click={() => changeOption("moderateUser")}>Moderate User</button>
		</div>
		<hr>
		<div id="UserContent">
			{#if currentTab == "none"}
				<p>No option selected</p>
			{:else if currentTab == "loading"}
				<h2>Loading...</h2>
			{:else if currentTab == "nameHistory"}
				<h2>Name History </h2>
				<div id="content"></div>
				<!-- {loadContent(nameHistory)} -->
			{:else if currentTab == "moderationHistory"}
				<h2>Moderation History</h2>
				<div id="content">
					{#each moderations ?? [] as moderation}
						<div id="moderation">
							<h3>{moderation.type}</h3>
							<hr>
							<p>Resolved: <b>{moderation.resolved}</b></p>
							{#if moderation.resolved == true}
								<p>Date Resolved: <b>{formatDate(new Date(moderation.dateResolved))}</b></p>
							{/if}
							<p>Reason: <b>{moderation.reason}</b></p>
							<p>Moderated By: <b>{moderation.admin.name}</b></p>
							<p>Date Moderated: <b>{formatDate(new Date(moderation.dateCreated))}</b></p>
							{#if moderation.expiresAt}
								<p>Date Moderation Expires: <b>{formatDate(new Date(moderation.expiresAt))}</b></p>
							{/if}
							{#if moderation.resolved == false}
								<button on:click={() => resolveModeration(moderation.id)}>Resolve Moderation</button>
							{/if}
						</div>
					{/each}
				</div>
				<!-- {loadContent(moderations)} -->
			{:else if currentTab == "sessions"}
				<h2>Sessions</h2>
				<div id="content">
					{#each sessions ?? [] as session}
						<div id="session">
							<b>Session Id: <b class="show">{session.id}</b></b>
							<br>
							<b>IP Address: <b class="hoverShow">{session.ip}</b></b>
							<br>
							<b>Location: <b class="show">{session.location}</b></b>
							<br>
							<b>User Agent: <b class="show">{session.userAgent}</b></b>
						</div>
					{/each}
				</div>
				<!-- {loadContent(sessions)} -->
			{:else if currentTab == "moderateUser"}
				<h2>Moderate User</h2>
				<form id="moderate">
					<div class="moderateItemContainer">
						<label for="moderationType"><b>Moderation Action:</b></label>
						<select name="moderationType" id="type" value="1" on:change={moderationTypeChange}>
							<option value="0">Name</option>
							<option value="1">Warn</option>
							<option value="2">Ban</option>
						</select>
					</div>
					<br>
					<textarea id="reason" placeholder="Reason"></textarea>
					<br>
					{#if moderationType != 1}
						<div class="moderateItemContainer">
							<label for="expiresAt"><b>Expires At:</b></label>
							<input name="expiresAt" type="date" id="expiresAt">
						</div>
						<div class="moderateItemContainer">
							<label for="perm"><b>Permanent?</b></label>
							<input name="perm" type="checkbox" id="perm" value="false">
						</div>
					{/if}
					<input type="button" value="Submit Action" on:click={moderateUser} />
					{#if moderateRes && !moderateRes.success}
						<br>
						<b>Failed to moderate user</b>
						<br>
						<b>Please send the following error in #staff-chat</b>
						<br>
						<b>{moderateRes?.message}</b>
					{:else if moderateRes && moderateRes.success}
						<br>
						<b>Successfully moderated the selected user</b>
					{/if}
				</form>
			{:else}
				<p>Unknown option selected<br>{currentTab}</p>
			{/if}
		</div>
	</div>
{:else}
	<h2>No user selected</h2>
{/if}

<style>
	form {
		text-align: left;
	}
	input, select {
		display: inline;
		min-width: 4em;
	}

	input,
	button,
	select,
	textarea {
		font-size: inherit;
		font-family: inherit;
		transition: background 0.1s, border 0.1s;
	}

	input, select, button, textarea {
		color: white;
		background-color: var(--color-bg-2);
		border-color: var(--color-bg-1);
		border-radius: 12px;
		border-style: solid;
		border-width: 2px;
		padding: 4px;
	}

	input:hover,
	button:hover,
	select:hover,
	textarea:hover {
		background-color: var(--color-bg-1);
		border-color: var(--color-bg-0);
		color: white;
	}


	#moderate {
		width: auto !important;
	}

	button.adminSelected {
		background-color: rgb(110, 110, 110) !important;
	}

	#moderate .moderateItemContainer {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		margin: 2px auto 2px auto;
	}

	#moderate .moderateItemContainer * {
		margin: 2px;
	}

	#moderation, #session {
		background-color: var(--color-bg-0);
		border-color: var(--color-bg-1);
		border-radius: 12px;
		border-style: solid;
		border-width: 2px;
		padding: 1rem;
	}

	#session .show {
		color: var(--color-theme-1);
	}

	#session .hoverShow {
		color: transparent;
		text-shadow: 0 0 12px var(--color-theme-1);
		transition: all 0.25s;
	}

	#session .hoverShow:hover {
		color: var(--color-theme-1);
		text-shadow: 0 0 0px var(--color-theme-1);
	}

	#moderation p {
		line-height: 1;
	}

	#moderation h3 {
		margin-top: 0;
		text-align: center;
	}

	#moderate {
		margin: auto;
		padding: 1em;
		background-color: var(--color-bg-0);
		border-color: var(--color-bg-1);
		border-radius: 1rem;
		border-style: solid;
	}

	#moderate textarea {
		min-width: 98%;
		max-width: 98%;
		min-height: 1.25em;
		max-height: 15em;
	}

	#moderate input {
		margin: 2px auto 2px auto;
		padding: 4px 1em 4px 1em;
	}

	#moderation {
		margin: 1rem;
	}

	#userButtonContainer {
		display: flex;
		flex-direction: row;
		justify-content: center;
		
	}
	#userButtonContainer button {
		margin: 0 5px;
	}
</style>
