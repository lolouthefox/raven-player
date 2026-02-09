<script lang="ts">
	import { libraryApi } from '$lib/api';
	import TrackList from '$lib/comps/TrackList.svelte';

	let { params } = $props();
</script>

{#await libraryApi.getAlbum(params.id)}
	<p>Loading album...</p>
{:then album}
	{@const coverUrl = libraryApi.getCoverUrl(album.songs[0].id)}
	<div class="header" style="background-image: url({coverUrl});">
		<div class="content">
			<img src={coverUrl} alt="" />
			<div class="meta">
				<h1>{album.title}</h1>
				<span class="artists">
					{#each album.artists as artist, i}
						{#if i > 0},
						{/if}
						<a href="/artist/{artist.id}">{artist.name}</a>
					{/each}
				</span>
			</div>
		</div>
		<div class="fx"></div>
	</div>
	<div class="songs">
		{#await libraryApi.getArtists(album.artists.map((artist) => artist.id))}
			<p>Loading artists...</p>
		{:then artists}
			<TrackList songs={album.songs} {artists} isAlbum />
		{/await}
	</div>
{/await}

<style>
	.header .content {
		display: flex;
		gap: 32px;
		padding: 16px;
		z-index: 1;
	}
	.header img {
		width: 256px;
		height: 256px;
		object-fit: cover;
		object-position: center;
		border-radius: 8px;
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.25);
	}
	.header .meta {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 8px;
		color: white;
	}
	.meta .artists {
		font-size: 14px;
		opacity: 0.75;
	}
	.header {
		position: relative;
		display: flex;
		gap: 16px;

		background-size: cover;
		background-position: center;

		padding: 64px;
	}
	.fx {
		position: absolute;

		inset: 0;
		width: 100%;
		height: 100%;

		background: linear-gradient(rgba(0, 0, 0, 0.5), black);
		backdrop-filter: blur(24px);
	}
</style>
