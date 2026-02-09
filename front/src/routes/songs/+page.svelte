<script lang="ts">
	import { libraryApi } from '$lib/api';
	import RescanButton from '$lib/comps/RescanButton.svelte';
	import { addToQueue, clearQueue, playNow, queueIndex } from '$lib/queue';
	let { data } = $props();
	let songs = $derived(data.songs);
</script>

<RescanButton />
<button
	onclick={() => {
		clearQueue();
		const shuffledSongs = [...songs].sort(() => Math.random() - 0.5);
		let shuffledQueue = shuffledSongs.slice(0, 100);
		for (const song of shuffledQueue) {
			addToQueue(song);
			queueIndex.set(0);
		}
	}}>Shuffle all</button
>
<div class="song-list">
	{#each songs as song}
		<button class="song" onclick={() => playNow(song)}>
			<img src={libraryApi.getCoverUrl(song.id)} alt="" />
			<div class="details">
				<p class="title">{song.title}</p>
			</div>
		</button>
	{/each}
</div>

<style>
	.song-list {
		padding: 24px;

		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.song {
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.song img {
		width: 64px;
		height: 64px;
		object-fit: cover;
		border-radius: 4px;
	}
	.details {
		display: flex;
		flex-direction: column;
	}
	.title {
		font-weight: bold;
	}
</style>
