<script lang="ts">
	import { libraryApi } from '$lib/api';
	import RescanButton from '$lib/comps/RescanButton.svelte';
</script>

<RescanButton />
{#await libraryApi.getArtists()}
	<p>Loading artists...</p>
{:then artists}
	<div class="artist-list">
		{#each artists as artist}
			<a class="artist" href={`/artist/${artist.id}`}>
				<div class="details">
					<p class="title">{artist.name}</p>
				</div>
			</a>
		{/each}
	</div>
{:catch error}
	<p>Error loading artists: {error.message}</p>
{/await}

<style>
	.artist-list {
		padding: 24px;

		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.artist {
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.details {
		display: flex;
		flex-direction: column;
	}
	.title {
		font-weight: bold;
	}
</style>
