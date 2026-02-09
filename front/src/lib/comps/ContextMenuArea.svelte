<script lang="ts">
	import ContextMenu from './ContextMenu.svelte';

	let { song, children }: { song: any; children: any } = $props();
	let showContextMenu = $state(false);
	let contextMenuPosition = $state({ x: 0, y: 0 });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	oncontextmenu={(e) => {
		e.preventDefault();
		contextMenuPosition = { x: e.clientX, y: e.clientY };
		showContextMenu = true;
	}}
>
	{@render children()}
	{#if showContextMenu}
		<ContextMenu {song} position={contextMenuPosition} bind:showContextMenu />
	{/if}
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
