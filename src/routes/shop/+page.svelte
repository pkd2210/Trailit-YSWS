<script lang="ts">
    import config from '$lib/stores/config.json';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import Card from '$lib/components/card.svelte';

    export let data;
    let items: any[] = [];
    let allItems: any[] = [];
    $: category = $page.url.searchParams.get('category') || 'all';
    $: items = category === 'all' ? allItems : allItems.filter(item => {
        return item.Category && Array.isArray(item.Category) && item.Category.includes(category);
    });


    onMount(async () => {
        const response = await fetch(`/shop/items`);
        if (response.ok) {
            const data = await response.json();
            allItems = Array.isArray(data) ? data : [data];
        } else {
            console.error('Failed to fetch items:', response.statusText);
        }
    });
</script>
<div class="flex flex-col gap-4">
    <section class="flex flex-col items-center justify-center gap-4">
        <div class="title">{config["ysws-name"]}'s Shop</div>
        {#if data.user}
        <div class="flex flex-wrap items-center justify-center gap-4">
            <a href="{config['url-base']}/shop/orders" class="px-4 py-2 bg-[var(--theme-color)] text-[var(--background-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow">Orders</a>
            <a href="{config['url-base']}/shop/projects" class="px-4 py-2 bg-[var(--theme-color)] text-[var(--background-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow">Projects</a>
        </div>
        {/if}
        <div class="subtitle" style="opacity: 0.7;">* Fullfillment will be based on local prices & availability.</div>
        {#if data.isAdmin}
                    <a target="_blank" href="https://dog-match.fillout.com/trailit-itemadd?passkey={data.filloutPasskey}" class="px-4 py-2 bg-[var(--theme-color)] text-[var(--background-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow">Create a new item</a>
        {/if}
    </section>
    <section class="flex flex-col items-center justify-center gap-4">
        <div class="flex flex-wrap items-center justify-center gap-4">
            <a href="?category=all" class="px-4 py-2 bg-transparent text-[var(--theme-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow border stroke-[var(--theme-color)]">All</a>
            <a href="?category=software" class="px-4 py-2 bg-transparent text-[var(--theme-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow border stroke-[var(--theme-color)]">Software</a>
            <a href="?category=audio" class="px-4 py-2 bg-transparent text-[var(--theme-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow border stroke-[var(--theme-color)]">Audio Recording</a>
            <a href="?category=video-editing" class="px-4 py-2 bg-transparent text-[var(--theme-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow border stroke-[var(--theme-color)]">Video Editing</a>
            <a href="?category=audio-editing" class="px-4 py-2 bg-transparent text-[var(--theme-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow border stroke-[var(--theme-color)]">Audio Editing</a>
            <a href="?category=photography" class="px-4 py-2 bg-transparent text-[var(--theme-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow border stroke-[var(--theme-color)]">Photography</a>
            <a href="?category=storage" class="px-4 py-2 bg-transparent text-[var(--theme-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow border stroke-[var(--theme-color)]">Storage</a>
            <a href="?category=accessories" class="px-4 py-2 bg-transparent text-[var(--theme-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow border stroke-[var(--theme-color)]">Accessories</a>
            <a href="?category=streaming" class="px-4 py-2 bg-transparent text-[var(--theme-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow border stroke-[var(--theme-color)]">Streaming</a>
            <a href="?category=other" class="px-4 py-2 bg-transparent text-[var(--theme-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow border stroke-[var(--theme-color)]">Other</a>
        </div>
    </section>
    <section class="cards-container">
        {#each items as item}
            <Card {item} {data} />
        {/each}
    </section>
</div>

<style>
    .cards-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        padding: 2rem 1rem;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .title {
        font-size: 2rem;
        font-weight: bold;
        text-align: center;
        margin: 1rem 0;
    }
</style>