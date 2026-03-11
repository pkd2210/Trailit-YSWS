<script>
    export let data;
    import config from '$lib/stores/config.json';
    import ReviewProductCard from '$lib/components/review-product-card.svelte';
    import { onMount } from 'svelte';
    //filloutPasskey
    //user
    //isAdmin
    //userTokens
    //userRecordId
    //reviewer
    //products
    const products = data.products || [];
    let username = '';
</script>
<div class="flex flex-col gap-4">
    <section class="flex flex-col items-center justify-center gap-4">
        <div class="title">{config["ysws-name"]}'s Product Reviews</div>
    </section>
    <section class="flex flex-col items-center justify-center gap-4">
        {#if products.length === 0}
            <div class="text-muted-foreground text-center">No products to review yet. Check back later!</div>
        {:else}
            <div class="flex flex-col gap-4 w-full max-w-4xl">
                {#each products as product}
                    <ReviewProductCard product={product["Product Name"]} username={product["SlackID"]} hoursSpent={product["Hours"]} status={product["Status"]} />
                {/each}
            </div>
        {/if}
    </section>
</div>