<script lang="ts">
    import { onMount } from 'svelte';

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

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
</script>

<div class="orders-container">
    <h1>My Orders</h1>

    {#if loading}
        <p class="loading">Loading orders...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else if orders.length === 0}
        <p class="empty">No orders yet</p>
    {:else}
        <div class="orders-list">
            {#each orders as order}
                <div class="order-card">
                    <div class="order-header">
                        <h3>{order.itemName}</h3>
                        <span class="status status-{order.Status?.toLowerCase()}">{order.Status}</span>
                    </div>
                    <div class="order-details">
                        <div class="detail">
                            <span class="label">Order ID:</span>
                            <span class="value">#{order['Order ID']}</span>
                        </div>
                        <div class="detail">
                            <span class="label">Price:</span>
                            <span class="value">{order.Price} tokens</span>
                        </div>
                        <div class="detail">
                            <span class="label">Order Date:</span>
                            <span class="value">{formatDate(order.OrderDate)}</span>
                        </div>
                    </div>
                </div>
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

    .order-card {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.2s;
    }

    .order-card:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e0e0e0;
    }

    .order-header h3 {
        margin: 0;
        font-size: 1.25rem;
        color: #333;
    }

    .status {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 500;
        text-transform: capitalize;
    }

    .status-pending {
        background: #fff3cd;
        color: #856404;
    }

    .status-completed {
        background: #d4edda;
        color: #155724;
    }

    .status-cancelled {
        background: #f8d7da;
        color: #721c24;
    }

    .order-details {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .detail {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .label {
        color: #6c757d;
        font-size: 0.9rem;
        font-weight: 500;
    }

    .value {
        color: #333;
        font-size: 0.95rem;
    }
</style>