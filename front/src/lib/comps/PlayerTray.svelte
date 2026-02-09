<script lang="ts">
	import { libraryApi } from '$lib/api';
	import { currentSong } from '$lib/queue';
	import playerTray from '$lib/playerTray';
	import type { Artist } from '$definitions/library';

	let currentArtists = $state<Artist[] | null>(null);
	currentSong.subscribe(async (song) => {
		if (song) {
			currentArtists = await libraryApi.getArtists(song.artistIds);
		} else {
			currentArtists = null;
			playerTray.set(false);
		}
	});
</script>

{#if $currentSong}
	<div
		class="tray"
		style="bottom: {$playerTray ? 0 : -100}%; background-image: url({libraryApi.getCoverUrl(
			$currentSong
		)});"
	>
		<div class="content">
			<div class="meta">
				<img src={libraryApi.getCoverUrl($currentSong)} alt="" />
				<div class="text">
					<h1 class="title">{$currentSong.title}</h1>
					<p class="artist">
						{currentArtists ? currentArtists.map((artist) => artist.name).join(', ') : ''}
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.tray {
		position: fixed;
		left: 0;
		width: 100%;
		height: 100%;
		transition: bottom 0.3s ease;
		z-index: 100;

		background-position: center;
		background-size: cover;
	}
	.content {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(48px);

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.meta {
		display: flex;
		align-items: center;
		gap: 32px;

		width: 100%;
		max-width: 1750px;
	}
	img {
		width: 544px;
		height: 544px;
		object-fit: cover;
		border-radius: 24px;
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.25);
	}
	.title {
		font-size: 64px;
		font-weight: bold;
	}
	.artist {
		font-size: 16px;
		opacity: 0.75;
	}
</style>
