<script lang="ts">
    import config from '$lib/stores/config.json';
    import { onMount } from 'svelte';
    import QuestCard from '$lib/components/questcard.svelte';

    interface Quest {
        id: string;
        fields: {
            [key: string]: any;
        };
        createdTime: string;
    }

    let quests: Quest[] = [];
    let userSlackId: string | null = null;
    let loading = true;
    let error = '';

    onMount(async () => {
        try {
            const response = await fetch('/api/quests');
            if (response.ok) {
                const data = await response.json();
                quests = data.quests || [];
                userSlackId = data.userSlackId || null;
            } else {
                error = 'Failed to load quests';
            }
        } catch (e) {
            error = 'Error loading quests';
            console.error(e);
        } finally {
            loading = false;
        }
    });
</script>

<div class="quests-container">
    <div class="flex flex-col gap-4">
        <section class="flex flex-col items-center justify-center gap-4">
            <div class="title">{config["ysws-name"]}'s Quests</div>
            <div class="flex flex-wrap items-center justify-center gap-4">
                <a href="{config['url-base']}/shop" class="px-4 py-2 bg-[var(--theme-color)] text-[var(--background-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow">Back to the shop</a><br>
            </div>
        </section>
    </div>

    {#if loading}
        <p class="loading">Loading quests...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else if quests.length === 0}
        <p class="empty">No quests found</p>
    {:else}
        <div class="quests-list">
            {#each quests as quest}
                <QuestCard {quest} {userSlackId} />
            {/each}
        </div>
    {/if}
</div>

<style>
    .quests-container {
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

    .quests-list {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        margin-top: 2rem;
    }
</style>