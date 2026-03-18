<script lang="ts">
	import '../app.css';
    import config from '$lib/stores/config.json';
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { ModeWatcher } from "mode-watcher";
	import SunIcon from "@lucide/svelte/icons/sun";
  	import MoonIcon from "@lucide/svelte/icons/moon";
 	import { toggleMode } from "mode-watcher";
 	import { Button } from "$lib/components/ui/button/index.js";

	let { children, data } = $props();
	const isMobile = new IsMobile();
</script>

<!--Sidebar-->
<Sidebar.Provider>
<AppSidebar {data}/>
{#if isMobile.current}
<Sidebar.Trigger class="fixed left-4 top-4 z-50" />
{/if}
<Sidebar.Inset>
<div
	class="app-root"
>
	<ModeWatcher />
	{@render children?.()}
	<Footer />
	<Button onclick={toggleMode} variant="outline" size="icon" class="fixed bottom-4 right-4 z-50">
	  <SunIcon
	    class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
	  />
	  <MoonIcon
	    class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
	  />
	  <span class="sr-only">Toggle theme</span>
	</Button>
</div>
</Sidebar.Inset>
</Sidebar.Provider>
<!--End of sidebard-->
<!--<div class="w-full">
		<div class="fixed top-4 left-0 right-0 z-50 flex flex-col items-center">
			<div style="color: var(--foreground); background-color: {config['background-color']}; border: 2px solid var(--muted-foreground);" class="flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg">
				{#if data.user}
				<span>{data.user.first_name} | <a href="{config['url-base']}/logout">Logout</a> | </span>
				{:else}
				<span><a href="{config['url-base']}/api/login">Login | </a></span>
				{/if}
				<a href="{config['url-base']}">Home</a>
				<a href="{config['url-base']}/shop">Shop</a>
				{#if data.user}
				<a href="{config['url-base']}/quests">Quests</a>
				{/if}
				{#if data.isAdmin}
				<a href="{config['url-base']}/admin">Admin</a>
				{/if}
				{#if data.user}
				<span>| {config['tokens-symbol']}: <span class="font-bold">{data.userTokens ? data.userTokens.toLocaleString() : '0'}</span></span>
				{/if}
			</div>
		</div>
	
</div>
-->
<svelte:head>
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="TrailIt YSWS" />
	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>

<style>
	:global(html) {
		background-color: var(--background-color);
	}
	
	.app-root {
		min-height: 100vh;
		background-color: var(--background-color);
		padding-top: 5rem;
		display: flex;
		flex-direction: column;
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
		font-size: 3.5rem;
		font-weight: bold;
		color: var(--foreground);
		margin-bottom: 1rem;
		text-align: center;
		font-family: "Phantom Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
	}
	
	:global(.subtitle) {
		font-size: 1.2rem;
		color: var(--muted-foreground);
		margin-bottom: 2rem;
	}
	
	:global(.theme-demo) {
		color: var(--foreground);
		font-weight: bold;
	}
	:global(.login-button) {
		background-color: var(--foreground);
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	:global(.hero-svg) {
		height: 500px;
		width: 500px;
		max-width: 90vw;
		max-height: 90vw;
	}

	@media (max-width: 768px) {
		:global(.hero-svg) {
			height: 300px;
			width: 300px;
		}
		
		:global(.title) {
			font-size: 2rem;
		}
		
		:global(.subtitle) {
			font-size: 1rem;
		}
	}

	@media (max-width: 480px) {
		:global(.hero-svg) {
			height: 200px;
			width: 200px;
		}
		
		:global(.title) {
			font-size: 1.5rem;
		}
	}
</style>