<script lang="ts">
	import { getContext } from 'svelte';
	import Title from "../Title.svelte";
	import { page } from "$app/stores";

	const admin: any = getContext("user");

	export let moderateRes: any;
	export let resolveModRes: any;
	
	var moderationType: number;

	var userId: number;
	var userName: string = "";

	var user: any;
	var sessions: Array<any>;
	var moderations: Array<any>;
	var nameHistory: String[];
	
	var currentTab: string = "none";

	var moderateUserTimeout: NodeJS.Timeout | null;  
	var resolveModerationTimeout: NodeJS.Timeout | null;
	const moderationTimeout: number = 3000;

	// Reset the data provided ig /shrug
	async function resetUserData() {
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

		await changeOption("none"); // Reset the option back to none
	}

	async function findUserId() {
		var element = document.getElementById("uid") as HTMLInputElement;
		var id = element.value;
		var result = await fetch(`/api/users/profile?id=${id}`);
		if (result.ok) {
			await resetUserData();
			user = await result.json();
		}
		userName = user?.name ?? "";
	}
	async function findUserName() {
		var element = document.getElementById("name") as HTMLInputElement;
		var name = element.value;
		var result = await fetch(`/api/users/profile?name=${name}`);
		if (result.ok) {
			await resetUserData();
			user = await result.json();
		}
		userId = user?.id ?? 0;
	}

	// TODO: Change the 3 functions here to be better
	async function getSessions() {
		if (!user) return;
		var result = await fetch(`/api/admin/users/sessions?id=${user.id}`);
		if (result.ok) sessions = await result.json();
	}
	
	async function getModerations() {
		if (!user) return;
		var result = await fetch(`/api/admin/users/cases?id=${user.id}`);
		if (result.ok) {
			var userModerations = await result.json();
			moderations = userModerations.sort((a: any, b: any) => -a.id);
		}
	}

	//TODO: Cache the result (probably not required tbh)
	async function getUser(id: number) {
		var result = await fetch(`/api/users/profile?id=${id}`);
		if (result.ok) return await result.json();
		return {id: 0, name: `Failed to get user ${id}` } // just so it's easier to send the error...
	}

	async function getNameHistory() {
		if (!user) return;
		nameHistory = user?.nameHistory ?? [];
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

	async function moderateUser()
	{
		if (!user) return;

		if (moderateUserTimeout != null) {
			clearTimeout(moderateUserTimeout);
			moderateUserTimeout = null;
		}

		var reason = document.getElementById("reason") as HTMLInputElement;
		var date = document.getElementById("expiresAt") as HTMLInputElement;
		var perm = document.getElementById("perm") as HTMLInputElement;

		var endDate = date?.value ?? "Never";
		if (perm?.value == "true") endDate = "Never";

		// TODO: Look into a better way of doing this link stuff
		var link = `/api/admin/users/moderate?id=${user.id}&type=${moderationType}${reason.value != "" ? "&reason=" + reason.value : ""}${endDate != "Never" ? "&date=" + endDate : ""}`;
		var result = await fetch(link);
		moderateRes = await result.json();

		moderateUserTimeout = setTimeout(() => {
			moderateRes = null; 
		}, moderationTimeout);
	}

	async function resolveModeration(caseId: number)
	{
		if (resolveModerationTimeout != null) {
			clearTimeout(resolveModerationTimeout);
			resolveModerationTimeout = null;
		}

		var result = await fetch(`/api/admin/users/moderate?id=${caseId}&resolve=true`);
		resolveModRes = await result.json();

		resolveModerationTimeout = setTimeout(() => {
			resolveModRes = null; 
		}, moderationTimeout);
		
		return resolveModRes
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

	async function load()
	{

		if ($page.data.currentUser != 0) {
			user = await getUser($page.data.currentUser);
			userId = user?.id;
			userName = user?.name;
			
			var tab = $page.data.currentTab;

			if (tab == 1) tab = "nameHistory";
			else if (tab == 2) tab = "moderationHistory";
			else if (tab == 3) tab = "sessions";
			else if (tab == 4) tab = "moderateUser";
			else tab = "none";

			await changeOption(tab);

			window.history.replaceState({}, "", "/admin")
		}
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
		min="0"
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

{#await load()}
<!-- Loading page -->
{/await}

{#if user}
	<h2>{user.name}</h2>
	<div id="userOptionsContainer">
		<hr>
		<div id="userButtonContainer">
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
					{#if resolveModRes && !resolveModRes[0]}
						<div class="note warning">
							<p><b>Warning!</b> Failed to resolve moderation<br>{resolveModRes[1]}</p>
						</div>
					{:else if resolveModRes && resolveModRes[0]}
						<div class="note success">
							<p><b>Success!</b> Successfully resolved moderation</p>
						</div>
					{/if}
					{#each moderations ?? [] as moderation}
						<div id="moderation">
							<h3>{moderation.type}</h3>
							<hr>
							<p>Resolved: <b id="Resolved-{moderation.id}">{moderation.resolved}</b></p>
							{#if moderation.resolved == true}
								<p>Date Resolved: <b>{formatDate(new Date(moderation.dateResolved))}</b></p>
							{/if}
							<p>Reason: <b>{moderation.reason}</b></p>
							<p>Moderated By: {#await getUser(moderation.adminId)}
								<b>Loading Admin...</b>
							{:then adminUser} 
								<b>{adminUser.name}</b>
							{/await}</p>
							<p>Date Moderated: <b>{formatDate(new Date(moderation.dateCreated))}</b></p>
							{#if moderation.expiresAt}
								<p>Date Moderation Expires: <b>{formatDate(new Date(moderation.expiresAt))}</b></p>
							{/if}
							{#if moderation.resolved == false}
								<button on:click={(event) => {
									var elem = event.currentTarget;
									resolveModeration(moderation.id).then((el) => {
										if (el[0] != true) return;
										var resolveTxt = document.getElementById(`Resolved-${moderation.id}`);
										if (resolveTxt != null) resolveTxt.innerText = "true";
										elem?.remove();
									})
								}}>Resolve Moderation</button>
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
							<b>IP Address: <b class="hoverShow" on:click={(event) => event.currentTarget.classList.toggle('adminSelected')} aria-hidden="true">{session.ip}</b></b>
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
				{#if moderateRes && !moderateRes[0]}
					<div class="note warning">
						<p><b>Warning!</b> Failed to moderate user<br>{moderateRes[1]}</p>
					</div>
				{:else if moderateRes && moderateRes[0]}
					<div class="note success">
						<p><b>Success!</b> Successfully moderated the selected user</p>
					</div>
				{/if}
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
							<!-- Hacky min date thing -->
							<input name="expiresAt" min="{new Date(Date.now() + 86400000).toISOString().split('T')[0]}" type="date" id="expiresAt">
						</div>
						<div class="moderateItemContainer">
							<label for="perm"><b>Permanent?</b></label>
							<input name="perm" type="checkbox" id="perm" value="false">
						</div>
					{/if}
					<input type="button" value="Submit Action" on:click={moderateUser} />
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
	.note {
		position: fixed;
		bottom: 35px;
		right: 20px;
		margin-left: 20px;
		max-width: 300px;
		margin-bottom: 15px;
  		padding: 4px 12px;
		color: black;
	}
	.note.success {
		background-color: #ddffdd;
		border-left: 6px solid #04AA6D;
	}
	.note.warning {
		background-color: #ffffcc;
		border-left: 6px solid #ffeb3b;
	}

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

	button:is(.adminSelected) {
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

	#session .hoverShow:hover,
	#session :is(.hoverShow.adminSelected) {
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
