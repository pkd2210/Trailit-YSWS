<script>
    import config from '$lib/stores/config.json';
    
    export let item;
</script>
<div class="card" style="border-color: {config['secondary-theme-color']}; background-color: {config['background-color']};">
    <h2 style="color: {config['theme-color']};">{item.name}</h2>
    <div class="content">
        <p>{item.description || 'No description available'}</p>
        <p style="font-weight: bold;">Price: {config['tokens-symbol']}{item.price}</p>
    </div>
    <div class="actions">
        <button style="background-color: {config['theme-color']}; color: {config['background-color']}; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
            Buy Now
        </button>
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
