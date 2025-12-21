<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
    import config from '$lib/stores/config.json';
	
	let { children, data } = $props();
</script>

<div class="w-full">
	{#if data.user}
		<div class="fixed top-4 left-0 right-0 z-50 flex flex-col items-center">
			<div style="color: {config['theme-color']}; background-color: {config['background-color']}; border: 2px solid {config['secondary-theme-color']};" class="flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg">
				<span>{data.user.first_name} | <a href="{config['url-base']}/logout">Logout</a> | </span>
				<a href="{config['url-base']}">Home</a>
				<a href="{config['url-base']}/shop">Shop</a>
				{#if data.isAdmin}
				<a href="{config['url-base']}/admin">Admin</a>
				{/if}
				<span>| {config['tokens-symbol']}: <span class="font-bold">{data.userTokens}</span></span>
			</div>
		</div>
	{/if}
	
</div>

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
		padding-top: 5rem;
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