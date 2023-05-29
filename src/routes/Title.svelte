<script lang="ts">
	export let title: boolean | string = false;
</script>

<svelte:head>
	<title>{title ? `${title} - Sound Space Plus` : "Sound Space Plus"}</title>
</svelte:head>
