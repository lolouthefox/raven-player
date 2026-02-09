<script lang="ts">
	import { secondsToFormattedTime } from '$lib';
	import { currentSong, playNow } from '$lib/queue';
	import ContextMenuArea from './ContextMenuArea.svelte';
	import Icon from './Icon.svelte';

	let {
		songs,
		artists,
		isAlbum = false
	}: {
		songs: any[];
		artists: any[];
		isAlbum?: boolean;
	} = $props();
</script>

<div class="track-list">
	<div class="header">
		<span class="indexColumn">#</span>
		<span class="titleColumn">Title</span>
		<span class="artistColumn">Artist</span>
		<span class="timeColumn">Time</span>
		<span class="contextColumn"></span>
	</div>
	{#each songs as song, index}
		{@const songArtists = artists.filter((artist) => song.artistIds.includes(artist.id))}
		<ContextMenuArea {song}>
			<button
				class="song"
				class:active={$currentSong?.id === song.id}
				ondblclick={() => {
					playNow(song);
				}}
			>
				<div class="indexColumn">
					{#if $currentSong?.id === song.id}
						<Icon icon="speaker-high" size="16px" />
					{:else}
						<span>{song.index}</span>
					{/if}
				</div>
				<div class="titleColumn">{song.title}</div>
				<div class="artistColumn">
					{#each songArtists as artist, i}
						{#if i > 0},{/if}
						<a href="/artist/{artist.id}">{artist.name}</a>
					{/each}
				</div>
				<div class="timeColumn">{secondsToFormattedTime(song.duration)}</div>
				<div class="contextColumn">
					<!-- Add action buttons here -->
				</div>
			</button>
		</ContextMenuArea>
	{/each}
</div>

<style>
	.track-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		padding: 0 24px;
	}
	button {
		text-align: left;
	}
	span {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.header span {
		font-weight: bold;
		text-transform: uppercase;
		font-size: 12px;
		opacity: 0.5;
		color: var(--text-secondary);
	}
	.header,
	.song {
		align-items: center;
		display: flex;
		gap: 16px;
		padding: 8px;
		height: 48px;
	}
	.song:hover {
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 4px;
	}
	.song.active {
		color: gold;
	}
	.indexColumn {
		flex: 0 0 42px;
		text-align: right;
	}
	.titleColumn {
		flex: 1 0 228px;
	}
	.artistColumn {
		flex: 1 1 170px;
	}
	.titleColumn {
		flex: 1 1 66px;
	}
	.contextColumn {
		flex: 0 0 100px;
		justify-content: flex-end;
	}
</style>
