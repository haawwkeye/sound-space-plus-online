<script lang="ts">
	import Title from "./Title.svelte";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	const { status } = $page;

	onMount(() => {
		var audio = document.getElementById(
			"super sad music"
		) as HTMLAudioElement;
		audio.volume = 0.1;
		audio.play();
	});
</script>

<Title title={status.toString()} />
<audio id="super sad music" src="/error.mp3" hidden />
<h1>{status}</h1>
