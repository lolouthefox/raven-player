<script lang="ts">
	import Icon from './Icon.svelte';

	let { icon, state = $bindable(false) } = $props();
</script>

<button onclick={() => (state = !state)} class:active={state}>
	<div class="icon">
		<Icon {icon} style="FILL" size="18px" />
	</div>
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
