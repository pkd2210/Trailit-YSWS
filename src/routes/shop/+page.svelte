<script>
    import config from '$lib/stores/config.json';
    import { onMount } from 'svelte';
    import Card from '$lib/components/card.svelte';

    let items = [];

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
<div class="title">{config["ysws-name"]}'s Shop</div>

{#each items as item}
    <Card {item} />
{/each}