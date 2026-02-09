<script lang="ts">
	import { addToQueue, clearQueue } from '$lib/queue';
	import Icon from './Icon.svelte';

	let { songs } = $props();
</script>

<div class="group">
	<button
		class="btn btn-primary"
		onclick={() => {
			clearQueue();
			for (const song of songs) {
				addToQueue(song);
			}
		}}
	>
		<Icon icon="play" size="24px" />
		Play
	</button>
	<button
		class="btn btn-secondary"
		onclick={() => {
			const shuffled = [...songs].sort(() => Math.random() - 0.5);
			clearQueue();
			for (const song of shuffled) {
				addToQueue(song);
			}
		}}
	>
		<Icon icon="shuffle" size="24px" />
		Shuffle
	</button>
</div>

<style>
	.group {
		display: flex;
		gap: 8px;
	}
	.btn {
		padding: 12px 24px;
		border: none;
		border-radius: calc(infinity * 1px);
		cursor: pointer;
		font-size: 16px;
		font-weight: bold;
		width: 175px;

		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;

		transition:
			transform 0.25s var(--anim-overshoot),
			background 0.25s ease;
	}
	.btn-primary {
		background-color: white;
		color: black;
	}
	.btn-primary:hover {
		background-color: rgba(255, 255, 255, 0.75);
	}
	.btn-secondary {
		background-color: rgba(255, 255, 255, 0.25);
		color: white;
	}
	.btn-secondary:hover {
		background-color: rgba(255, 255, 255, 0.4);
	}
	button:hover {
		transform: scale(1.025);
	}
	button:active {
		transform: scale(0.975);
	}
</style>
