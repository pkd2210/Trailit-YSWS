<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
    import config from '$lib/stores/config.json';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	style="
		--background-color: {config['background-color']};
		--secondary-theme-color: {config['secondary-theme-color']};
		--theme-color: {config['theme-color']};
	"
	class="app-root"
>
	{@render children()}
</div>

<style>
	:global(html) {
		background-color: var(--background-color);
	}
	
	.app-root {
		min-height: 100vh;
		background-color: var(--background-color);
	}

	:global(.center) {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem;
	}
	
	:global(.title) {
		font-size: 3rem;
		font-weight: bold;
		color: var(--theme-color);
		margin-bottom: 1rem;
		text-align: center;
	}
	
	:global(.subtitle) {
		font-size: 1.2rem;
		color: var(--secondary-theme-color);
		margin-bottom: 2rem;
	}
	
	:global(.theme-demo) {
		color: var(--theme-color);
		font-weight: bold;
	}
	:global(.login-button) {
		background-color: var(--theme-color);
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}
</style>