<script lang="ts">
	import { Lrc } from 'lrc-kit';
	import currentTime from '$lib/currentTime';
	let { rawLyrics }: { rawLyrics: string } = $props();
	let lrc = $derived(Lrc.parse(rawLyrics));
	let lyricsEl: HTMLDivElement | null = null;
	let activeIndex = $derived(
		lrc.lyrics.reduce((lastIndex, line, index) => {
			return line.timestamp <= $currentTime ? index : lastIndex;
		}, -1)
	);

	$effect(() => {
		if (!lyricsEl || activeIndex < 0) return;
		const activeEl = lyricsEl.querySelector(
			`[data-line-index="${activeIndex}"]`
		) as HTMLElement | null;
		if (!activeEl) return;
		lyricsEl.scrollTo({
			behavior: 'smooth',
			top: activeEl.offsetTop - lyricsEl.clientHeight / 2 + activeEl.clientHeight / 2
		});
	});
</script>

<div class="lyrics" bind:this={lyricsEl}>
	{#each lrc.lyrics as line, index}
		<button
			class="line"
			class:active={line.timestamp <= $currentTime}
			class:inactive={line.timestamp < $currentTime && activeIndex !== index}
			data-line-index={index}
			onclick={() => {
				// Seek to the line's timestamp when clicked
				currentTime.set(-line.timestamp);
			}}
		>
			{line.content}
		</button>
	{/each}
</div>

<style>
	.lyrics {
		display: flex;
		flex-direction: column;
		gap: 64px;

		width: 100%;
		max-width: 1000px;

		max-height: 75vh;
		height: 100%;
		overflow: auto;
	}
	.lyrics::-webkit-scrollbar {
		width: 0px;
		height: 0px;
	}

	.line {
		font-size: 48px;
		color: white;
		transition-duration: 0.25s;
		text-align: left;
		opacity: 0.75;
	}

	.line.active {
		opacity: 1;
		font-weight: bold;
	}
	.line.inactive {
		opacity: 0.25;
		font-weight: normal;
	}
</style>
