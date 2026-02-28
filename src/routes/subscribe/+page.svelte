<script lang="ts">
    import config from '$lib/stores/config.json';
    import { onMount } from 'svelte';

    let { data } = $props();
    let subscribed = $state(false);
    let loading = $state(true);
    let updating = $state(false);
    let message = $state('');

    onMount(async () => {
        if (!data.user) {
            loading = false;
            return;
        }
        try {
            const res = await fetch('/api/subscribe');
            if (res.ok) {
                const result = await res.json();
                subscribed = result.subscribed;
            }
        } catch (e) {
            console.error('Error fetching subscription status:', e);
        } finally {
            loading = false;
        }
    });

    async function toggleSubscription() {
        updating = true;
        message = '';
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscribe: !subscribed })
            });
            if (res.ok) {
                const result = await res.json();
                subscribed = result.subscribed;
                message = subscribed
                    ? 'You are now subscribed to updates!'
                    : 'You have been unsubscribed.';
            } else {
                message = 'Something went wrong. Please try again.';
            }
        } catch (e) {
            console.error('Error updating subscription:', e);
            message = 'Something went wrong. Please try again.';
        } finally {
            updating = false;
        }
    }
</script>

<div class="center">
    <div class="title">{config['ysws-name']} Updates</div>
    <p class="subtitle">Subscribe to receive notifications about new items and announcements.</p>

    {#if !data.user}
        <p style="color: var(--secondary-theme-color); margin-bottom: 1.5rem;">
            Please <a href="/api/login" style="color: var(--theme-color);">log in</a> to manage your subscription.
        </p>
        <a href="/api/login"><button class="login-button">Login</button></a>
    {:else if loading}
        <p style="color: var(--secondary-theme-color);">Loading subscription status...</p>
    {:else}
        <div class="subscription-card" style="border-color: {config['secondary-theme-color']}; background-color: {config['background-color']};">
            <p style="color: var(--secondary-theme-color); margin-bottom: 1rem;">
                {#if subscribed}
                    ✅ You are currently <strong style="color: var(--theme-color);">subscribed</strong> to updates.
                {:else}
                    You are currently <strong>not subscribed</strong> to updates.
                {/if}
            </p>
            <button
                onclick={toggleSubscription}
                disabled={updating}
                class="subscribe-button"
                style="background-color: {subscribed ? '#6c757d' : config['theme-color']};"
            >
                {#if updating}
                    {subscribed ? 'Unsubscribing...' : 'Subscribing...'}
                {:else}
                    {subscribed ? 'Unsubscribe' : 'Subscribe'}
                {/if}
            </button>
            {#if message}
                <p class="message" style="color: var(--theme-color);">{message}</p>
            {/if}
        </div>
        <br>
        <a href="{config['url-base']}/shop" style="color: var(--theme-color);">← Back to Shop</a>
    {/if}
</div>

<style>
    .subscription-card {
        border: 2px solid;
        border-radius: 12px;
        padding: 2rem;
        max-width: 480px;
        width: 100%;
        text-align: center;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .subscribe-button {
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        font-size: 1rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: background-color 0.3s ease, opacity 0.2s ease;
        font-weight: 600;
    }

    .subscribe-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .subscribe-button:not(:disabled):hover {
        opacity: 0.85;
    }

    .message {
        margin-top: 1rem;
        font-size: 0.95rem;
    }
</style>
