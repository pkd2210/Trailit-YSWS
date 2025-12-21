<script>
    import config from '$lib/stores/config.json';
    import { onMount } from 'svelte';

    let items = [];

    onMount(async () => {
        const response = await fetch('/shop/items');
        if (response.ok) {
            items = await response.json();
        } else {
            console.error('Failed to fetch items:', response.statusText);
        }
    });
</script>
<div class="title">{config["ysws-name"]}'s Shop</div>
