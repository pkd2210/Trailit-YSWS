<script>
    import config from '$lib/stores/config.json';
    
    export let item;
    export let data;

    function confirmPurchase(item) {
        return confirm(`Are you sure you want to purchase ${item.name} for ${config['tokens-symbol']}${item.price ? item.price.toLocaleString() : '0'}?`);
    }

    async function handleBuy(item, data) {
        if (!confirmPurchase(item)) {
            return;
        }
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
            <label for="grant-amount">Enter the amount of dollars you need on your grant (exp, 10$ = ${item.price || 0}${config['tokens-symbol']} * 10$ = ${(item.price || 0) * 10}${config['tokens-symbol']}): </label>
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
            <p style="font-weight: bold; color: {config['secondary-theme-color']};">Price: {config['tokens-symbol']}{item.price ? item.price.toLocaleString() : '0'}{#if item.type == "grant"} Per Dollar{/if}</p>
        </div>
        {#if data.user}
        <div class="actions">
            <div class="action-row">
                {#if item.type == "grant"}
                    <button on:click={() => handleBuyGrant(item, data)} style="background-color: {config['theme-color']}; color: {config['background-color']}; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
                        Get Grant
                    </button>
                {:else}
                    {#if item.price<= data.userTokens}
                    <button  on:click={() => handleBuy(item, data)} style="background-color: {config['theme-color']}; color: {config['background-color']}; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
                        Buy Now
                    </button>
                    {:else}
                    <button disabled style="background-color: grey; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: not-allowed;">
                        Insufficient Funds, missing {config['tokens-symbol']}{item.price - data.userTokens}
                    </button>
                    {/if}
                {/if}
                {#if data.isAdmin}
                    <a href="https://dog-match.fillout.com/t/tMmMMisQ5yus?passkey={data.filloutPasskey}&id={item.recordId}" target="_blank" class="settings-link" style="color: {config['theme-color']};">
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
