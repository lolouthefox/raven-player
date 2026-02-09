<script lang="ts">
	import { libraryApi } from '$lib/api';

	let rescanning = $state(false);

	async function rescan() {
		rescanning = true;
		await libraryApi.rescanLibrary();
		rescanning = false;
	}
</script>

<button disabled={rescanning} onclick={rescan}>{rescanning ? 'Rescanning...' : 'Rescan'}</button>
