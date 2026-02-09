<script lang="ts">
	import { libraryApi } from '$lib/api';
	import RescanButton from '$lib/comps/RescanButton.svelte';

	let { data } = $props();
</script>

<RescanButton />
<div class="album-list">
	{#each data.albums as album}
		<a class="album" href={`/album/${album.id}`}>
			<img src={libraryApi.getCoverUrl(album.songs[0].id)} alt="" />
			<div class="details">
				<p class="title">{album.title}</p>
				<p class="artists">{album.artists.map((artist) => artist.name).join(', ')}</p>
			</div>
		</a>
	{/each}
</div>

<style>
	.album-list {
		padding: 24px;

		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.album {
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.album img {
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
