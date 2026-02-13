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
        <div class="flex flex-wrap items-center justify-center gap-4">
            <a href="{config['url-base']}/shop/orders" class="px-4 py-2 bg-[var(--theme-color)] text-[var(--background-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow">Orders</a>
            <a href="{config['url-base']}/shop/projects" class="px-4 py-2 bg-[var(--theme-color)] text-[var(--background-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow">Projects</a>
        </div>
    </section>
</div>
{#each items as item}
    <Card {item} {data} />
{/each}