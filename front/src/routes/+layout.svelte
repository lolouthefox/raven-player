<script lang="ts">
	import '../global.css';
	import favicon from '$lib/assets/favicon.svg';
	import Player from '$lib/comps/Player.svelte';
	import Icon from '$lib/comps/Icon.svelte';
	import { page } from '$app/state';
	import { currentSong } from '$lib/queue';
	import QueueTray from '$lib/comps/QueueTray.svelte';
	import PlayerTray from '$lib/comps/PlayerTray.svelte';

	let { children } = $props();

	let tabs = {
		'/': { name: 'Home', icon: 'house' },
		'/songs': { name: 'Songs', icon: 'music-note' },
		'/albums': { name: 'Albums', icon: 'disc' },
		'/artists': { name: 'Artists', icon: 'user' }
	};
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{#if $currentSong}
		<title>Music Player - {$currentSong.title}</title>
	{:else}
		<title>Music Player</title>
	{/if}
	<link
		rel="stylesheet"
		type="text/css"
		href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css"
	/>
	<link
		rel="stylesheet"
		type="text/css"
		href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/fill/style.css"
	/>
	<link href="https://api.fontshare.com/v2/css?f[]=satoshi@1,2&display=swap" rel="stylesheet" />
</svelte:head>

<main>
	<div class="nav">
		{#each Object.entries(tabs) as [path, tab]}
			<a href={path} class:active={page.url.pathname === path}>
				<Icon icon={tab.icon} size="24px" />
				{tab.name}
			</a>
		{/each}
	</div>
	<div class="content">{@render children()}</div>
	<QueueTray />
	<Player />
	<PlayerTray />
</main>

<style>
	main {
		display: flex;
		height: 100dvh;
		position: relative;
	}
	.content {
		flex: 1;
		overflow: auto;
		padding-bottom: 128px;
	}
	.nav {
		width: 300px;
		background-color: rgba(255, 255, 255, 0.05);
		padding: 12px;
	}
	.nav a {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		color: inherit;
		text-decoration: none;
		border-radius: 8px;
	}
	.nav a:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
	.nav a.active {
		background-color: white;
		color: black;
	}
</style>
