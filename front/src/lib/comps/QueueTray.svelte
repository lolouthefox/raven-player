<script lang="ts">
	import type { Artist } from '$definitions/library';
	import { libraryApi } from '$lib/api';
	import { queue, queueIndex } from '$lib/queue';
	import queueTray from '$lib/queueTray';
	import JuicyButton from './JuicyButton.svelte';

	let artists: Artist[] = $state([]);

	queue.subscribe(async (songs) => {
		await Promise.all(
			songs.map(async (song) => {
				const songArtists = await libraryApi.getArtists(song.artistIds);
				artists.push(...songArtists);
			})
		);
		// Remove duplicates
		artists = artists.filter(
			(artist, index, self) => index === self.findIndex((a) => a.id === artist.id)
		);
	});
</script>

<div class="queue-tray" style="right: {$queueTray ? 24 : -400}px;">
	<div class="content">
		{#each $queue as song, index}
			{@const songArtists = artists.filter((artist) => song.artistIds.includes(artist.id))}
			<div class="song" class:current={index === $queueIndex}>
				<button onclick={() => queueIndex.set(index)}>
					<img src={libraryApi.getCoverUrl(song)} alt="" />
					<div class="metadata">
						<p class="title">{song.title}</p>
						<span class="artists">
							{#each songArtists as artist, i}
								{artist.name}{i < songArtists.length - 1 ? ', ' : ''}
							{/each}
						</span>
					</div>
				</button>
				<JuicyButton
					icon="trash"
					onclick={(e: MouseEvent) => {
						e.stopPropagation();
						queue.update((q) => {
							q.splice(index, 1);
							return q;
						});
					}}
				/>
			</div>
		{/each}
	</div>
</div>

<style>
	.queue-tray {
		position: fixed;

		top: 24px;
		bottom: 24px;
		width: 400px;

		background-color: rgba(75, 75, 75, 0.5);
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.25);
		backdrop-filter: blur(16px);
		border-radius: 24px;
		transition: right 0.5s var(--anim-overshoot);

		z-index: 900;
	}

	.content {
		height: 100%;
		width: 100%;
		padding: 8px;

		display: flex;
		flex-direction: column;
	}

	.song {
		cursor: pointer;

		display: flex;
		align-items: center;

		text-align: left;

		padding: 12px;
		border-radius: 16px;
		user-select: none;
		transition-duration: 0.25s;
	}
	.song:hover {
		background-color: rgb(50, 50, 50);
	}
	.song.current {
		background-color: rgb(75, 75, 75);
		color: white;
	}
	.song button {
		flex: 1 0 0;
		display: flex;
		align-items: center;
		text-align: left;
		gap: 12px;
	}
	img {
		width: 48px;
		height: 48px;
		border-radius: 4px;
		object-fit: cover;
	}
	.title {
		font-weight: bold;
	}
	.artists {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.75);
	}
</style>
