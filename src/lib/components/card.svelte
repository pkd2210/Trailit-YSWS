<script>
    import config from '$lib/stores/config.json';
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";

    export let item;
    export let data;

    // Dialog states
    let showPurchaseConfirm = false;
    let showPurchaseSuccess = false;
    let showGrantError = false;
    let showGrantSuccess = false;
    let showGrantInput = false;
    let pendingPurchaseItem = null;
    let pendingGrantItem = null;
    let grantAmount = 1;

    function showPurchaseDialog(item) {
        pendingPurchaseItem = item;
        showPurchaseConfirm = true;
    }

    async function confirmPurchase() {
        showPurchaseConfirm = false;
        if (!pendingPurchaseItem) return;
        
        try {
            const response = await fetch('/shop/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ item: pendingPurchaseItem, data })
            });
            if (response.ok) {
                const result = await response.json();
                console.log('Purchase successful:', result);
                showPurchaseSuccess = true;
            }
        } catch (error) {
            console.error('Error purchasing item:', error);
        }
        pendingPurchaseItem = null;
    }

    function handlePurchaseSuccess() {
        showPurchaseSuccess = false;
        window.location.reload();
    }

    function showGrantDialog(item) {
        pendingGrantItem = item;
        grantAmount = 1;
        showGrantInput = true;
    }

    async function confirmGrantPurchase() {
        showGrantInput = false;
        if (!pendingGrantItem || isNaN(grantAmount) || grantAmount < 1) {
            showGrantError = true;
            return;
        }
        
        try {
            const response = await fetch('/shop/buy-grant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ item: pendingGrantItem, data, amount: grantAmount })
            });
            if (response.ok) {
                const result = await response.json();
                console.log('Grant purchase successful:', result);
                showGrantSuccess = true;
            }
        } catch (error) {
            console.error('Error purchasing grant:', error);
        }
        pendingGrantItem = null;
    }

    function handleGrantSuccess() {
        showGrantSuccess = false;
        window.location.reload();
    }
</script>
<div class="card" style="border-color: var(--muted-foreground); background-color: var(--background-color);">
    {#if item.image}
        <div class="image-container">
            <img src={item.image} alt={item.name} class="item-image" />
        </div>
    {/if}
    <div class="card-body">
        <h2 style="color: var(--foreground);">{item.name}</h2>
        <div class="content">
            <p style="color: var(--muted-foreground);">{item.description || 'No description available'}</p>
            <p style="font-weight: bold; color: var(--muted-foreground);">Price: {config['tokens-symbol']}{item.price ? item.price.toLocaleString() : '0'}{#if item.type == "grant"} Per Dollar{/if}</p>
        </div>
        {#if data.user}
        <div class="actions">
            <div class="action-row">
                {#if item.type == "grant"}
                    {#if item.price<= data.userTokens}
                    <button on:click={() => showGrantDialog(item)} style="background-color: var(--foreground); color: var(--background-color); border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
                        Get Grant
                    </button>
                    {:else}
                    <button disabled style="background-color: grey; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: not-allowed;">
                        Insufficient Funds, missing {config['tokens-symbol']}{item.price - data.userTokens}
                    </button>
                    {/if}
                {:else}
                    {#if item.price<= data.userTokens}
                    <button  on:click={() => showPurchaseDialog(item)} style="background-color: var(--foreground); color: var(--background-color); border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
                        Buy Now
                    </button>
                    {:else}
                    <button disabled style="background-color: grey; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: not-allowed;">
                        Insufficient Funds, missing {config['tokens-symbol']}{item.price - data.userTokens}
                    </button>
                    {/if}
                {/if}
                {#if data.isAdmin}
                    <a href="https://dog-match.fillout.com/t/tMmMMisQ5yus?passkey={data.filloutPasskey}&id={item.recordId}" target="_blank" class="settings-link" style="color: var(--foreground);">
                        <svg fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414" xmlns="http://www.w3.org/2000/svg" aria-label="settings" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="24" height="24" title="settings">
                            <g>
                                <path d="M9.752,9.489l2.302,0.705c0.552,-0.373 1.161,-0.669 1.81,-0.873l0.885,-2.239c0.397,-0.054 0.803,-0.082 1.216,-0.082c0.413,0 0.819,0.028 1.217,0.082l0.884,2.239c0.649,0.204 1.258,0.5 1.81,0.873l2.302,-0.705c0.588,0.56 1.1,1.2 1.519,1.901l-1.2,2.088c0.238,0.616 0.391,1.274 0.446,1.959l1.987,1.361c-0.073,0.828 -0.257,1.624 -0.539,2.372l-2.383,0.364c-0.341,0.583 -0.764,1.111 -1.253,1.57l0.176,2.403c-0.673,0.446 -1.408,0.804 -2.191,1.057l-1.77,-1.636c-0.328,0.048 -0.664,0.072 -1.005,0.072c-0.341,0 -0.676,-0.024 -1.005,-0.072l-1.77,1.636c-0.782,-0.253 -1.518,-0.611 -2.19,-1.057l0.175,-2.403c-0.489,-0.459 -0.912,-0.987 -1.253,-1.57l-2.383,-0.364c-0.281,-0.748 -0.466,-1.544 -0.539,-2.372l1.987,-1.361c0.055,-0.685 0.208,-1.343 0.446,-1.959l-1.199,-2.088c0.419,-0.701 0.93,-1.341 1.518,-1.901Zm6.213,10.511c2.209,0 4,-1.791 4,-4c0,-2.209 -1.791,-4 -4,-4c-2.209,0 -4,1.791 -4,4c0,2.209 1.791,4 4,4Z"></path>
                            </g>
                        </svg>
                    </a>
                {/if}
            </div>
        </div>
        {/if}
    </div>
</div>

<!-- Purchase Confirmation Dialog -->
<AlertDialog.Root bind:open={showPurchaseConfirm}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Confirm Purchase</AlertDialog.Title>
            <AlertDialog.Description>
                Are you sure you want to purchase {pendingPurchaseItem?.name || ''} for {config['tokens-symbol']}{pendingPurchaseItem?.price ? pendingPurchaseItem.price.toLocaleString() : '0'}?
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel style="cursor: pointer;">Cancel</AlertDialog.Cancel>
            <AlertDialog.Action onclick={confirmPurchase} style="cursor: pointer;">Confirm Purchase</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>

<!-- Purchase Success Dialog -->
<AlertDialog.Root bind:open={showPurchaseSuccess}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Purchase Successful!</AlertDialog.Title>
            <AlertDialog.Description>
                Your purchase has been completed successfully.
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Action onclick={handlePurchaseSuccess} style="cursor: pointer;">OK</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>

<!-- Grant Error Dialog -->
<AlertDialog.Root bind:open={showGrantError}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Invalid Grant Amount</AlertDialog.Title>
            <AlertDialog.Description>
                Please enter a valid grant amount greater than 0.
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Action onclick={() => showGrantError = false} style="cursor: pointer;">OK</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>

<!-- Grant Success Dialog -->
<AlertDialog.Root bind:open={showGrantSuccess}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Grant Purchase Successful!</AlertDialog.Title>
            <AlertDialog.Description>
                Your grant purchase has been completed successfully.
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Action onclick={handleGrantSuccess} style="cursor: pointer;">OK</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>

<!-- Grant Amount Input Dialog -->
<AlertDialog.Root bind:open={showGrantInput}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Enter Grant Amount</AlertDialog.Title>
            <AlertDialog.Description>
                Enter the amount in dollars you need on your grant. 
                <br />
                Example: $10 = {pendingGrantItem?.price || 0}{config['tokens-symbol']} × 10 = {(pendingGrantItem?.price || 0) * 10}{config['tokens-symbol']}
            </AlertDialog.Description>
        </AlertDialog.Header>
        <div class="p-4">
            <label for="grant-amount-input" class="block text-sm font-medium mb-2">Amount ($):</label>
            <input 
                id="grant-amount-input"
                type="number" 
                bind:value={grantAmount}
                min="1" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount in dollars"
            />
        </div>
        <AlertDialog.Footer>
            <AlertDialog.Cancel style="cursor: pointer;">Cancel</AlertDialog.Cancel>
            <AlertDialog.Action onclick={confirmGrantPurchase} style="cursor: pointer;">Confirm Grant</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
<style>
    .card {
        border: 2px solid;
        width: clamp(280px, 25vw, 350px);
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        min-height: 350px;
        position: relative;
        overflow: hidden;
    }
    
    .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
    }
    
    .image-container {
        width: 100%;
        height: 200px;
        overflow: hidden;
        border-radius: 10px 10px 0 0;
        position: relative;
        background-color: white !important;
        box-sizing: border-box;
    }
    
    .item-image {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain;
        object-position: center;
        transition: transform 0.3s ease;
        background-color: white !important;
        border-radius: 0px;
    }
    
    .card:hover .item-image {
        transform: scale(1.05);
    }
    
    .card-body {
        padding: 1.5rem;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
    
    .card-body h2 {
        margin: 0 0 1rem 0;
        font-size: 1.25rem;
        font-weight: 600;
        line-height: 1.3;
    }
    
    .content {
        margin: 0 0 1.5rem 0;
        flex-grow: 1;
    }
    
    .content p {
        margin: 0.5rem 0;
        line-height: 1.5;
    }
    
    .content p:first-child {
        font-size: 0.95rem;
        opacity: 0.9;
    }
    
    .content p:last-child {
        font-size: 1.1rem;
        margin-top: 1rem;
    }
    
    .actions {
        text-align: center;
        margin-top: auto;
        flex-shrink: 0;
    }
    
    .action-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        justify-content: center;
    }
    
    .actions button {
        flex: 1;
        padding: 0.75rem 1.5rem !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
        font-size: 0.95rem;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .settings-link {
        color: inherit;
        opacity: 0.7;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        border-radius: 4px;
    }
    
    .settings-link:hover {
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.05);
        transform: scale(1.1);
    }
    
    .actions button:not(:disabled):hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    .actions button:disabled {
        opacity: 0.7;
        transform: none !important;
    }
</style>
