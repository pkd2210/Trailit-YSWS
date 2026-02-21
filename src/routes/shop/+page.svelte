<script lang="ts">
    import config from '$lib/stores/config.json';
    import { onMount } from 'svelte';
    import Card from '$lib/components/card.svelte';

    export let data;
    let items: any[] = [];

    onMount(async () => {
        const response = await fetch('/shop/items');
        if (response.ok) {
            const data = await response.json();
            items = Array.isArray(data) ? data : [data];
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