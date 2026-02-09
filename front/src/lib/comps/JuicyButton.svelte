<script lang="ts">
	import Icon from './Icon.svelte';

	let { icon, onclick } = $props();
</script>

<button {onclick}>
	<div class="icon">
		<Icon {icon} style="FILL" size="20px" />
	</div>
</button>

<style>
	button {
		position: relative;

		color: white;
		background: rgba(255, 255, 255, 0.15);
		border-radius: 50%;

		width: 48px;
		height: 48px;

		transition:
			transform 0.25s var(--anim-overshoot),
			background 0.25s ease;
	}
	button:hover {
		background: rgba(255, 255, 255, 0.25);
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
