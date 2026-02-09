<script lang="ts">
	import { libraryApi } from '$lib/api';
	import RescanButton from '$lib/comps/RescanButton.svelte';
	import { playNow } from '$lib/queue';
</script>

<RescanButton />
{#await libraryApi.getSongs()}
	<p>Loading songs...</p>
{:then songs}
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
{:catch error}
	<p>Error loading songs: {error.message}</p>
{/await}

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
