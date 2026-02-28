<script>
    import config from '$lib/stores/config.json';
    
    export let order;

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function getItemName() {
        return order.itemName || 'Unknown Item';
    }

    function getStatus() {
        return order.Status || 'Unknown';
    }

    function getStatusClass(status) {
        if (status?.toLowerCase().includes('pending')) return 'status-pending';
        if (status?.toLowerCase().includes('completed') || status?.toLowerCase().includes('approved')) return 'status-completed';
        if (status?.toLowerCase().includes('cancelled') || status?.toLowerCase().includes('rejected')) return 'status-cancelled';
        return 'status-unknown';
    }
</script>

<div class="order-card" style="border-color: {config['secondary-theme-color']}; background-color: {config['background-color']};">
    <div class="order-header">
        <h2 style="color: {config['theme-color']};">{getItemName()}</h2>
        <span class="status {getStatusClass(getStatus())}">{getStatus()}</span>
    </div>
    
    <div class="content">
        <div class="order-details">
            <div class="detail-row">
                <span class="label">Order ID:</span>
                <span class="value">#{order['Order ID']}</span>
            </div>
            <div class="detail-row">
                <span class="label">Price:</span>
                <span class="value">{order.Price} {config["tokens-symbol"]}</span>
            </div>
            <div class="detail-row">
                <span class="label">Order Date:</span>
                <span class="value">{formatDate(order.OrderDate)}</span>
            </div>
        </div>
    </div>
</div>

<style>
    .order-card {
        border: 2px solid;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.2s;
    }
    
    .order-card:hover {
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--secondary-theme-color, #e0e0e0);
    }

    .order-header h2 {
        margin: 0;
        font-size: 1.25rem;
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

    .status-unknown {
        background: #e2e3e5;
        color: #383d41;
    }

    .content {
        margin: 1rem 0;
    }
    
    .order-details {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .detail-row {
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
        color: #ec3750;
        font-size: 0.95rem;
        text-align: right;
        flex: 1;
        margin-left: 1rem;
    }
</style>