<script lang="ts">
	import { libraryApi } from '$lib/api';
	import { currentSong } from '$lib/queue';
	import playerTray from '$lib/playerTray';
	import type { Artist } from '$definitions/library';
	import { getLyrics, type LyricsResponse } from '$lib';
	import { fade } from 'svelte/transition';
	import Icon from './Icon.svelte';
	import showLyrics from '$lib/showLyrics';
	import SyncedLyricsDisplay from './SyncedLyricsDisplay.svelte';

	let currentArtists = $state<Artist[] | null>(null);
	let lyrics: LyricsResponse | null = $state(null);
	let lyricsLoading = $state(false);

	currentSong.subscribe(async (song) => {
		const loadingSong = song; // Capture reference to prevent race condition
		lyrics = null;
		if (song) {
			lyricsLoading = true;
			// Load artists
			libraryApi.getArtists(song.artistIds).then((artists) => {
				if ($currentSong === loadingSong) {
					currentArtists = artists;
				}
			});
			// Load lyrics
			getLyrics(song).then((loadedLyrics) => {
				if ($currentSong === loadingSong) {
					lyrics = loadedLyrics;
					lyricsLoading = false;
				}
			});
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
			{#if $showLyrics && !lyricsLoading}
				{#if lyrics?.syncedLyrics}
					<SyncedLyricsDisplay rawLyrics={lyrics?.syncedLyrics} />
				{:else if lyrics?.plainLyrics}
					<pre transition:fade={{ duration: 1000 }}>{lyrics.plainLyrics}</pre>
				{/if}
			{/if}
			<div class="meta" class:tinymeta={$showLyrics && lyrics?.plainLyrics}>
				<img src={libraryApi.getCoverUrl($currentSong)} alt="" />
				<div class="text">
					<h1 class="title">{$currentSong.title}</h1>
					<p class="artist">
						{currentArtists ? currentArtists.map((artist) => artist.name).join(', ') : ''}
					</p>
					{#if $showLyrics}
						{#if lyricsLoading}
							<div class="badge loading">
								<Icon icon="microphone-stage" size="24px" />
								Loading lyrics...
							</div>
						{:else if lyrics?.instrumental}
							<div class="badge">
								<Icon icon="guitar" size="24px" />
								Instrumental
							</div>
						{/if}
					{/if}
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
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		display: flex;
		align-items: center;
		gap: 32px;

		width: 100%;
		max-width: 1750px;

		transition: all 1s ease;
	}
	img {
		width: 544px;
		height: 544px;
		object-fit: cover;
		border-radius: 24px;
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.25);

		transition: all 1s ease;
	}
	.title {
		font-size: 64px;
		font-weight: bold;

		transition: all 1s ease;
	}
	.artist {
		font-size: 16px;
		opacity: 0.75;
	}

	/* TinyMeta is used when lyrics are available, to save space for the lyrics */
	.tinymeta {
		display: flex;
		align-items: center;
		gap: 16px;
		transform: translate(0, 0);

		position: absolute;
		top: 24px;
		left: 24px;
	}
	.tinymeta img {
		width: 128px;
		height: 128px;
		border-radius: 16px;
	}
	.tinymeta .title {
		font-size: 24px;
	}

	pre {
		width: 100%;
		max-width: 800px;
		max-height: 75vh;
		overflow: auto;
	}

	.badge {
		margin-top: 12px;

		background-color: rgba(255, 255, 255, 0.25);
		color: rgba(255, 255, 255, 0.75);
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.25);
		border-radius: calc(infinity * 1px);
		padding: 8px 16px;
		font-size: 16px;

		display: flex;
		align-items: center;
		gap: 12px;

		width: fit-content;
	}
	.badge.loading {
		animation: pulse 2s infinite;
	}
	@keyframes pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
		100% {
			opacity: 1;
		}
	}
</style>
