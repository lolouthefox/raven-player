<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Song } from '$definitions/library';
	import { playLast, playNext } from '$lib/queue';
	import Icon from './Icon.svelte';
	let {
		song,
		position,
		showContextMenu = $bindable(false)
	}: { song: Song; position: { x: number; y: number }; showContextMenu?: boolean } = $props();
</script>

<svelte:body onclick={() => (showContextMenu = false)} />

<div class="context-menu" style="top: {position.y}px; left: {position.x}px;">
	<button
		class="option"
		onclick={() => {
			playNext(song);
			showContextMenu = false;
		}}><Icon size="24px" icon="rows-plus-top" /> Play next</button
	>
	<button
		class="option"
		onclick={() => {
			playLast(song);
			showContextMenu = false;
		}}><Icon size="24px" icon="rows-plus-bottom" /> Play after</button
	>

	<!--<div class="option">Add to playlist</div>-->
	<button
		class="option"
		onclick={() => {
			goto('/artist/' + song.artistIds[0]);
			showContextMenu = false;
		}}><Icon size="24px" icon="user-circle" /> Go to artist</button
	>
	<button
		class="option"
		onclick={() => {
			goto('/album/' + song.albumId);
			showContextMenu = false;
		}}><Icon size="24px" icon="disc" /> Go to album</button
	>
	<!--<div class="option">Share</div>-->
	<!--<div class="option">Delete</div>-->
</div>

<style>
	.context-menu {
		position: fixed;
		z-index: 1000;

		border-radius: 8px;
		padding: 4px;
		width: 250px;

		display: flex;
		flex-direction: column;

		box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
		background-color: rgb(30, 30, 30);
	}

	.option {
		padding: 12px 12px;
		cursor: pointer;
		text-align: left;
		align-items: center;

		display: flex;
		gap: 12px;
	}

	.option:hover {
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 4px;
	}
</style>
