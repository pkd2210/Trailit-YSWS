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

    let selectedCategory = category;

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
            <a href="{config['url-base']}/shop/orders" class="px-4 py-2 bg-[var(--foreground)] text-[var(--background-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow">Orders</a>
            <a href="{config['url-base']}/shop/projects" class="px-4 py-2 bg-[var(--foreground)] text-[var(--background-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow">Projects</a>
        </div>
        {/if}
        <!--<div class="subtitle" style="opacity: 0.7;">* Fullfillment will be based on local prices & availability.</div>-->
        {#if data.isAdmin}
                    <a target="_blank" href="https://dog-match.fillout.com/trailit-itemadd?passkey={data.filloutPasskey}" class="px-4 py-2 bg-[var(--foreground)] text-[var(--background-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow">Create a new item</a>
        {/if}
    </section>
    <section class="flex flex-col items-center justify-center gap-4">
        <div class="flex flex-wrap items-center justify-center gap-4">
            <a href="?category=all" class="category-button {category === 'all' ? 'selected' : ''}">All</a>
            <a href="?category=software" class="category-button {category === 'software' ? 'selected' : ''}">Software</a>
            <a href="?category=audio" class="category-button {category === 'audio' ? 'selected' : ''}">Audio Recording</a>
            <a href="?category=video-editing" class="category-button {category === 'video-editing' ? 'selected' : ''}">Video Editing</a>
            <a href="?category=audio-editing" class="category-button {category === 'audio-editing' ? 'selected' : ''}">Audio Editing</a>
            <a href="?category=photography" class="category-button {category === 'photography' ? 'selected' : ''}">Photography</a>
            <a href="?category=storage" class="category-button {category === 'storage' ? 'selected' : ''}">Storage</a>
            <a href="?category=accessories" class="category-button {category === 'accessories' ? 'selected' : ''}">Accessories</a>
            <a href="?category=streaming" class="category-button {category === 'streaming' ? 'selected' : ''}">Streaming</a>
            <a href="?category=other" class="category-button {category === 'other' ? 'selected' : ''}">Other</a>
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
    

    .category-button {
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        border: 2px solid var(--foreground);
        background-color: transparent;
        color: var(--foreground);
        text-decoration: none;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        font-weight: 500;
    }

    .category-button:hover {
        background-color: var(--foreground);
        color: var(--background-color);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
    }

    .category-button.selected {
        background-color: var(--foreground);
        color: var(--background-color);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        font-weight: 600;
    }

    .category-button.selected:hover {
        background-color: var(--muted-foreground);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }
</style>