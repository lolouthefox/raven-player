<script lang="ts">
	import { libraryApi } from '$lib/api';
	import TrackList from '$lib/comps/TrackList.svelte';

	let { data } = $props();
	let artist = $derived(data.artist);
	let profile = $derived(data.profile);
	let allArtists = $derived(data.allArtists);
</script>

<div class="banner" style="background-image: url({profile?.banner})">
	<div class="artist">
		<div class="text">
			{#if profile}
				<img class="pfp" src={profile.profilePicture} alt="" />
			{/if}
			<h1>{artist.name}</h1>
		</div>
	</div>
	<div class="fx"></div>
</div>
<div class="discography">
	{#await libraryApi.getAlbums(artist.albumIds)}
		<p>Loading albums...</p>
	{:then albums}
		{#each albums as album}
			<div class="album">
				<div class="meta">
					<img src={libraryApi.getCoverUrl(album)} alt="" />
					<h2>{album.title}</h2>
				</div>
				<TrackList songs={album.songs} artists={allArtists} isAlbum={true} />
			</div>
		{/each}
	{/await}
</div>
{#if profile?.biography}
	<div class="bio">
		<h2>Biography</h2>
		<p>{profile.biography}</p>
	</div>
{/if}

<style>
	.album {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 24px;
	}
	.meta {
		display: flex;
		gap: 16px;
		align-items: center;
		padding: 24px;
	}
	.meta img {
		width: 128px;
		height: 128px;
		object-fit: cover;
		border-radius: 8px;
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.25);
	}

	.banner {
		position: relative;
		display: flex;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		background-color: white;
	}
	.artist {
		padding: 64px;
		height: 50vh;
		display: flex;
		align-items: flex-end;
		gap: 32px;
		z-index: 1;
	}
	.pfp {
		width: 128px;
		height: 128px;
		object-fit: cover;
		border-radius: 50%;
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.25);
	}
	.fx {
		position: absolute;

		inset: 0;
		width: 100%;
		height: 100%;

		background: linear-gradient(rgba(0, 0, 0, 0.5), black);
	}
	.text {
		display: flex;
		align-items: center;
		gap: 24px;
		color: white;
	}
	.bio {
		padding: 48px;
		color: rgba(255, 255, 255, 0.5);
	}
	.bio h2 {
		font-size: 24px;
		margin-bottom: 12px;
		color: white;
	}
</style>
