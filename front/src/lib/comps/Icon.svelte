<script lang="ts">
	export let icon: string = 'seal-question';
	export let color: string | null = null;
	export let style: string = 'FILL';
	export let size: string = '32px';
	export let customStyle: string = '';

	const styles: Record<string, string> = {
		THIN: 'ph-thin',
		LIGHT: 'ph-light',
		REGULAR: 'ph',
		BOLD: 'ph-bold',
		FILL: 'ph-fill',
		DUO: 'ph-duotone'
	};
</script>

<i
	class="{styles[style]} ph-{icon}"
	style="{color ? `color: ${color};` : ''}font-size: {size}; {customStyle}"
></i>
