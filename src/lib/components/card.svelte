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
            <label for="grant-amount">Enter the amount of dollars you need on your grant (exp, 10$ = ${item.price}${config['tokens-symbol']} * 10$ = ${item.price * 10}${config['tokens-symbol']}): </label>
            <input type="number" id="grant-amount" name="grant-amount" min="1" required />
        `;
        const userInput = prompt('Enter Grant amount ($):', '1');
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
    {#if item.image}
        <div class="image-container">
            <img src={item.image} alt={item.name} class="item-image" />
        </div>
    {/if}
    <div class="card-body">
        <h2 style="color: {config['theme-color']};">{item.name}</h2>
        <div class="content">
            <p style="color: {config['secondary-theme-color']};">{item.description || 'No description available'}</p>
            <p style="font-weight: bold; color: {config['secondary-theme-color']};">Price: {config['tokens-symbol']}{item.price}{#if item.type == "grant"} Per Dollar{/if}</p>
        </div>
        {#if data.user}
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
        {/if}
    </div>
</div>
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
    }
    
    .item-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        transition: transform 0.3s ease;
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
    
    .actions button {
        width: 100%;
        padding: 0.75rem 1.5rem !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
        font-size: 0.95rem;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
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
