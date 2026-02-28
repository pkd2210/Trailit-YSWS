<script lang="ts">
    import config from '$lib/stores/config.json';
    import { onMount } from 'svelte';
    import OrderCard from '$lib/components/ordercard.svelte';

    interface Order {
        id: string;
        'Order ID': number;
        Status: string;
        OrderDate: string;
        Price: number;
        itemName: string;
    }

    let orders: Order[] = [];
    let loading = true;
    let error = '';

    onMount(async () => {
        try {
            const response = await fetch('/shop/orders/api');
            if (response.ok) {
                orders = await response.json();
            } else {
                error = 'Failed to load orders';
            }
        } catch (e) {
            error = 'Error loading orders';
            console.error(e);
        } finally {
            loading = false;
        }
    });
</script>

<div class="orders-container">
    <div class="flex flex-col gap-4">
    <section class="flex flex-col items-center justify-center gap-4">
        <div class="title">{config["ysws-name"]}'s Orders</div>
        <div class="flex flex-wrap items-center justify-center gap-4">
            <a href="{config['url-base']}/shop" class="px-4 py-2 bg-[var(--theme-color)] text-[var(--background-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow">Back to the shop</a><br>
        </div>
    </section>
</div>

    {#if loading}
        <p class="loading">Loading orders...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else if orders.length === 0}
        <p class="empty">No orders yet</p>
    {:else}
        <div class="orders-list">
            {#each orders as order}
                <OrderCard {order} />
            {/each}
        </div>
    {/if}
</div>

<style>
    .orders-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        text-align: center;
        margin-bottom: 2rem;
        color: #333;
    }

    .loading, .error, .empty {
        text-align: center;
        padding: 2rem;
        font-size: 1.1rem;
    }

    .error {
        color: #dc3545;
    }

    .empty {
        color: #6c757d;
    }

    .orders-list {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
</style>