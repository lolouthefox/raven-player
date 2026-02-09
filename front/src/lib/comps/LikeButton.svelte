<script>
	import Icon from './Icon.svelte';
	let state = $state(false);
</script>

<button onclick={() => (state = !state)} class:active={state}>
	<div class="icon">
		<Icon icon="heart" size="18px" />
	</div>
</button>

<style>
	button {
		padding: 6px;
		border-radius: 50%;
		cursor: pointer;
		background-color: rgba(255, 255, 255, 0.15);
		color: white;
		transition-timing-function: var(--anim-overshoot);
		transition-duration: 0.25s;
		transition-delay: 0;
	}
	button.active {
		background-color: white;
		color: rgb(30, 30, 30);
		transition-delay: 0.65s;
	}
	button:hover {
		transition-delay: 0;
	}
	button:active {
		transition-delay: 0;
	}

	.icon {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 100%;
		height: 100%;
	}
	.active .icon {
		animation: overshoot 1s var(--anim-overshoot);
	}
	@keyframes overshoot {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.75);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
