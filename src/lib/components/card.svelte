<script>
    import config from '$lib/stores/config.json';
    
    export let item;
    export let data;

    async function handleBuy(item, data) {
            try {
                const response = await fetch('/shop/buy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ item, data })
                });
                if (response.ok) {
                    const result = await response.json();
                    console.log('Purchase successful:', result);
                    alert('Purchase successful!');
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error purchasing item:', error);
            }
    }

    async function handleBuyGrant(item, data) {
        const grantAmount = document.createElement('div');
        grantAmount.innerHTML = `
            <label for="grant-amount">Enter Grant Amount (${config['tokens-symbol']}): </label>
            <input type="number" id="grant-amount" name="grant-amount" min="1" required />
        `;
        const userInput = prompt('Enter Grant Amount (' + config['tokens-symbol'] + '):', '1');
        const amount = parseInt(userInput);
        if (isNaN(amount) || amount < 1) {
            alert('Invalid grant amount.');
            return;
        }
        try {
            const response = await fetch('/shop/buy-grant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ item, data, amount })
            });
            if (response.ok) {
                const result = await response.json();
                console.log('Grant purchase successful:', result);
                alert('Grant purchase successful!');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error purchasing grant:', error);
        }
    }
</script>
<div class="card" style="border-color: {config['secondary-theme-color']}; background-color: {config['background-color']};">
    <h2 style="color: {config['theme-color']};">{item.name}</h2>
    <div class="content">
        <p>{item.description || 'No description available'}</p>
        <p style="font-weight: bold;">Price: {config['tokens-symbol']}{item.price}{#if item.type == "grant"} Per Dollar{/if}</p>
    </div>
    <div class="actions">
        {#if item.type == "grant"}
            <button on:click={() => handleBuyGrant(item, data)} style="background-color: {config['theme-color']}; color: {config['background-color']}; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
                Get Grant
            </button>
        {:else}
            {#if item.price <= data.userTokens}
            <button  on:click={() => handleBuy(item, data)} style="background-color: {config['theme-color']}; color: {config['background-color']}; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
                Buy Now
            </button>
            {:else}
            <button disabled style="background-color: grey; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: not-allowed;">
                Insufficient Funds, missing {config['tokens-symbol']}{item.price - data.userTokens}
            </button>
            {/if}
        {/if}
    </div>
</div>
<style>
    .card {
        border: 2px solid;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .content {
        margin: 1rem 0;
    }
    .actions {
        text-align: right;
    }
</style>
