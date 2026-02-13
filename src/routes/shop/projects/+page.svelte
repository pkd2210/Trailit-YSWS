<script lang="ts">
    import config from '$lib/stores/config.json';
    import { onMount } from 'svelte';
    import ProjectCard from '$lib/components/projectcard.svelte';

    interface Project {
        id: string;
        fields: {
            [key: string]: any;
        };
        createdTime: string;
    }

    let projects: Project[] = [];
    let loading = true;
    let error = '';

    onMount(async () => {
        try {
            const response = await fetch('/api/projects');
            if (response.ok) {
                projects = await response.json();
            } else {
                error = 'Failed to load projects';
            }
        } catch (e) {
            error = 'Error loading projects';
            console.error(e);
        } finally {
            loading = false;
        }
    });
</script>

<div class="projects-container">
    <div class="flex flex-col gap-4">
        <section class="flex flex-col items-center justify-center gap-4">
            <div class="title">{config["ysws-name"]}'s Projects</div>
            <div class="flex flex-wrap items-center justify-center gap-4">
                <a href="{config['url-base']}/shop" class="px-4 py-2 bg-[var(--theme-color)] text-[var(--background-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow">Back to the shop</a><br>
            </div>
        </section>
    </div>

    {#if loading}
        <p class="loading">Loading projects...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else if projects.length === 0}
        <p class="empty">No projects found</p>
    {:else}
        <div class="projects-list">
            {#each projects as project}
                <ProjectCard {project} />
            {/each}
        </div>
    {/if}
</div>

<style>
    .projects-container {
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

    .projects-list {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        margin-top: 2rem;
    }
</style>