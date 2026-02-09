<script lang="ts">
	import Icon from './Icon.svelte';
	import { sineInOut } from 'svelte/easing';

	let { state = $bindable('disabled') }: { state?: 'disabled' | 'repeat' | 'one' } = $props();

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

<button
	onclick={() => {
		state = state === 'disabled' ? 'repeat' : state === 'repeat' ? 'one' : 'disabled';
	}}
	class:active={state !== 'disabled'}
>
	{#if state === 'disabled' || state === 'repeat'}
		<div class="icon" transition:expand={{ duration: 250 }}>
			<Icon icon="repeat" style="FILL" size="24px" />
		</div>
	{/if}
	{#if state === 'one'}
		<div class="icon" transition:expand={{ duration: 250 }}>
			<Icon icon="repeat-once" style="FILL" size="24px" />
		</div>
	{/if}
</button>

<style>
	button {
		position: relative;

		color: white;
		background: rgba(255, 255, 255, 0);
		border-radius: 50%;

		width: 40px;
		height: 40px;

		transition:
			transform 0.25s var(--anim-overshoot),
			background 0.25s ease;
	}
	button:hover {
		transform: scale(1.1);
		background: rgba(255, 255, 255, 0.15);
	}
	button:active {
		transform: scale(0.9);
	}
	button.active {
		background: rgba(255, 255, 255, 0.3);
	}
	.icon {
		display: flex;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
