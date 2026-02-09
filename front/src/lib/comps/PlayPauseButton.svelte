<script lang="ts">
	import Icon from './Icon.svelte';
	import { sineInOut } from 'svelte/easing';

	let { paused, onclick } = $props();

	function expand(
		node: HTMLElement,
		params: { delay?: number; duration?: number; easing?: (t: number) => number }
	) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');

		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || sineInOut,
			css: (t: number, u: number) => `transform: ${existingTransform} scale(${t}); opacity: ${t};`
		};
	}
</script>

<button {onclick}>
	{#if paused}
		<div class="icon" transition:expand={{ duration: 250 }}>
			<Icon icon="play" style="FILL" size="24px" />
		</div>
	{/if}
	{#if !paused}
		<div class="icon" transition:expand={{ duration: 250 }}>
			<Icon icon="pause" style="FILL" size="24px" />
		</div>
	{/if}
</button>

<style>
	button {
		position: relative;

		color: black;
		background: white;
		border-radius: 50%;

		width: 48px;
		height: 48px;

		transition:
			transform 0.25s var(--anim-overshoot),
			opacity 0.25s ease;
	}
	button:hover {
		opacity: 0.75;
		transform: scale(1.1);
	}
	button:active {
		transform: scale(0.9);
	}
	.icon {
		display: flex;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
