<script lang="ts">
	import { libraryApi } from '$lib/api';
	import type { Artist } from '$definitions/library';
	import { onMount } from 'svelte';
	import { currentSong, skipNext, skipPrevious } from '$lib/queue';
	import PlayPauseButton from './PlayPauseButton.svelte';
	import JuicyButton from './JuicyButton.svelte';
	import JuicyToggleButton from './JuicyToggleButton.svelte';
	import RepeatButton from './RepeatButton.svelte';
	import { secondsToFormattedTime } from '$lib';
	import LikeButton from './LikeButton.svelte';
	import Icon from './Icon.svelte';
	import queueTray from '$lib/queueTray';
	import playerTray from '$lib/playerTray';
	import showLyrics from '$lib/showLyrics';

	let currentArtists: Artist[] | null = $state(null);
	let player: HTMLAudioElement | null = $state(null);
	let paused = $state(true);
	let songProgress: number = $state(0);

	currentSong.subscribe(async (song) => {
		if (song) {
			currentArtists = await libraryApi.getArtists(song.artistIds);

			// Update Media Session API metadata
			if ('mediaSession' in navigator) {
				const artistNames = currentArtists?.map((a) => a.name).join(', ') || 'Unknown Artist';
				navigator.mediaSession.metadata = new MediaMetadata({
					title: song.title,
					artist: artistNames,
					album: '',
					artwork: [{ src: libraryApi.getCoverUrl(song), sizes: '512x512', type: 'image/jpeg' }]
				});
			}
		} else {
			currentArtists = null;
			if ('mediaSession' in navigator) {
				navigator.mediaSession.metadata = null;
			}
		}
	});

	function togglePlayPause() {
		if (!player) return;
		if (player.paused) {
			player.play();
		} else {
			player.pause();
		}
		paused = player.paused;
	}

	onMount(() => {
		// Set up Media Session API action handlers
		if ('mediaSession' in navigator) {
			navigator.mediaSession.setActionHandler('play', () => {
				player?.play();
			});
			navigator.mediaSession.setActionHandler('pause', () => {
				player?.pause();
			});
			navigator.mediaSession.setActionHandler('previoustrack', () => {
				skipPrevious();
			});
			navigator.mediaSession.setActionHandler('nexttrack', () => {
				skipNext();
			});
			navigator.mediaSession.setActionHandler('seekto', (details) => {
				if (player && details.seekTime) {
					player.currentTime = details.seekTime;
				}
			});
		}
	});

	let shuffle = $state(false);
	let repeat: 'disabled' | 'repeat' | 'one' = $state('disabled');

	let playerTrayOpen = $state(false);
	$effect(() => {
		playerTray.set(playerTrayOpen);
	});
	playerTray.subscribe((open) => {
		playerTrayOpen = open;
	});

	let queueTrayOpen = $state(false);
	$effect(() => {
		queueTray.set(queueTrayOpen);
	});
	queueTray.subscribe((open) => {
		queueTrayOpen = open;
	});

	let showLyricsState = $state(false);
	$effect(() => {
		showLyrics.set(showLyricsState);
	});
	showLyrics.subscribe((show) => {
		showLyricsState = show;
	});
</script>

<div class="player">
	{#if $currentSong && player}
		<div class="player-actions">
			<JuicyToggleButton icon="shuffle" bind:state={shuffle} />
			<JuicyButton
				icon="skip-back"
				onclick={() => {
					if (player && player.currentTime > 5) {
						player.currentTime = 0;
						return;
					}
					skipPrevious();
				}}
			/>
			<PlayPauseButton {paused} onclick={togglePlayPause} />
			<JuicyButton
				icon="skip-forward"
				onclick={() => {
					skipNext();
				}}
			/>
			<RepeatButton bind:state={repeat} />
		</div>

		<div class="metadata">
			<img src={libraryApi.getCoverUrl($currentSong)} alt="" height="64" width="64" class="cover" />
			<div class="song-infos">
				<div class="info">
					<div class="text">
						<a class="title" href="/album/{$currentSong.albumId}">{$currentSong.title}</a>
						<span class="artists">
							{#each currentArtists as artist, i}
								{#if i > 0},
								{/if}
								<a href="/artist/{artist.id}">{artist.name}</a>
							{/each}
						</span>
					</div>
					<div class="actions">
						{#key songProgress}
							<p class="timer">
								<span style="opacity: .75;">{secondsToFormattedTime(player.currentTime)} • </span>
								<span><strong>{secondsToFormattedTime(player.duration)}</strong></span>
							</p>
						{/key}
						<LikeButton />
					</div>
				</div>

				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<div
					class="progress-wrap"
					tabindex="0"
					onclick={(e) => {
						if (!player) return;
						const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
						const clickX = e.clientX - rect.left;
						const newTime = (clickX / rect.width) * player.duration;
						player.currentTime = newTime;
					}}
					onkeydown={(e) => {
						if (!player) return;
						if (e.key === 'ArrowLeft') {
							player.currentTime = Math.max(0, player.currentTime - 5);
						} else if (e.key === 'ArrowRight') {
							player.currentTime = Math.min(player.duration, player.currentTime + 5);
						}
					}}
					role="progressbar"
					aria-valuenow={songProgress}
					aria-valuemin="0"
					aria-valuemax="100"
				>
					<div class="progress-bar">
						<div class="progress" style="width: {songProgress}%;"></div>
					</div>
				</div>
			</div>
		</div>

		<div class="left-actions">
			<JuicyToggleButton icon="microphone-stage" bind:state={showLyricsState} />
			<JuicyToggleButton icon="monitor-play" bind:state={playerTrayOpen} />
			<JuicyToggleButton icon="queue" bind:state={queueTrayOpen} />
			<p class="quality">{$currentSong.quality}</p>
		</div>
	{:else}
		<p>No song playing</p>
	{/if}

	{#if $currentSong}
		<audio
			bind:this={player}
			onpause={() => {
				paused = true;
			}}
			onplay={() => {
				paused = false;
			}}
			ontimeupdate={() => {
				if (!player) return;
				songProgress = (player.currentTime / player.duration) * 100;

				// Update Media Session API position state
				if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
					if (isFinite(player.duration) && isFinite(player.currentTime)) {
						navigator.mediaSession.setPositionState({
							duration: player.duration,
							playbackRate: player.playbackRate,
							position: player.currentTime
						});
					}
				}

				if (songProgress == 100) {
					if (repeat === 'one') {
						player.currentTime = 0;
						player.play();
						return;
					}
					skipNext(repeat === 'repeat');
				}
			}}
			src={libraryApi.getAudioUrl($currentSong)}
			autoplay
		></audio>
	{/if}
</div>

<style>
	.timer {
		font-size: 12px;
	}
	.player {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px;

		background-color: rgba(75, 75, 75, 0.5);
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.25);
		backdrop-filter: blur(12px);
		border-radius: calc(infinity * 1px);

		position: absolute;
		bottom: 24px;
		left: 24px;
		right: 24px;

		height: 88px;
		max-width: 1400px;
		margin: 0 auto;

		z-index: 1000;
	}
	.metadata {
		width: 500px;

		display: flex;
		align-items: center;
		gap: 12px;

		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	.metadata .song-infos {
		flex: 1 0 0;

		text-overflow: ellipsis;
		white-space: nowrap;

		display: flex;
		justify-content: center;
		flex-direction: column;
		gap: 3px;
	}
	.metadata .song-infos .title {
		font-weight: bold;
	}
	.cover {
		border-radius: 8px;
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.25);
		object-fit: cover;
		object-position: center;
	}
	audio {
		width: 100%;
	}

	.progress-wrap {
		width: 100%;
		height: 16px;

		display: flex;
		justify-content: center;
		align-items: center;
	}
	.progress-bar {
		width: 100%;
		height: 4px;
		background-color: rgba(255, 255, 255, 0.15);
		border-radius: calc(infinity * 1px);
		overflow: hidden;
		cursor: pointer;

		transition: 0.25s;
	}
	.progress-wrap:hover .progress-bar {
		outline: none;
		height: 10px;
	}
	.progress-wrap:focus .progress-bar {
		background-color: rgba(255, 255, 255, 0.25);
	}
	.progress {
		height: 100%;
		background-color: #fff;
	}
	.info {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.text {
		display: flex;
		flex-direction: column;
	}
	.player-actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.quality {
		background-color: rgba(0, 0, 0, 0.15);
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
		border-radius: calc(infinity * 1px);
		padding: 12px 24px;

		user-select: none;
	}
	.title {
		width: 300px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.artists {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.75);
	}
	.left-actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}
</style>
