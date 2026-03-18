<script>
    import config from '$lib/stores/config.json';

    export let project;

    import { onMount } from 'svelte';

    const slackId = Array.isArray(project['SlackID']) ? project['SlackID'][0] : project['SlackID'];

    let displayName = slackId;
    onMount(async () => {
        if (slackId) {
            try {
                const res = await fetch(`https://cachet.dunkirk.sh/users/${slackId}`);
                if (res.ok) {
                    const data = await res.json();
                    displayName = data.displayName || slackId;
                }
            } catch {}
        }
    });

    function isMp4(url) {
        return typeof url === 'string' && /\.mp4(\?.*)?$/i.test(url);
    }

    const screenshot = project['Screenshot'] || '';
</script>

<div class="gallery-card" style="border-color: var(--muted-foreground); background-color: var(--background);">
    <div class="card-header">
        <h2 style="color: var(--foreground);">{project['Product Name'] || 'Untitled'}</h2>
        <span class="hours">{project['Hours']}h</span>
    </div>

    <div class="media">
        {#if screenshot && isMp4(screenshot)}
            <video controls preload="metadata" src={screenshot}>
                <track kind="captions" />
            </video>
        {:else if screenshot}
            <img src={screenshot} alt={project['Product Name']} />
        {:else}
            <div class="media-fallback">No preview</div>
        {/if}
    </div>

    {#if project['Description']}
        <p class="description" style="color: var(--muted-foreground);">{project['Description'].trim()}</p>
    {/if}

    <div class="detail-row">
        <span class="label">GitHub User:</span>
        <a class="value" href="https://github.com/{project['GitHub Username']}" target="_blank" rel="noreferrer">@{project['GitHub Username']}</a>
    </div>
    {#if slackId}
    <div class="detail-row">
        <span class="label">Slack:</span>
        <a class="slack-user" href="https://hackclub.slack.com/team/{slackId}" target="_blank" rel="noreferrer">
            <img src="https://cachet.dunkirk.sh/users/{slackId}/r" alt="slack avatar" class="slack-avatar" />
            @{displayName}
        </a>
    </div>
    {/if}

    <div class="actions">
        {#if project['Code URL']}
            <a href={project['Code URL']} target="_blank" rel="noreferrer"
               style="background-color: var(--foreground); color: var(--background);">
                View Code
            </a>
        {/if}
        {#if project['Playable URL']}
            <a href={project['Playable URL']} target="_blank" rel="noreferrer"
               style="background-color: var(--muted-foreground); color: var(--background);">
                Try It
            </a>
        {/if}
    </div>
</div>

<style>
    .gallery-card {
        border: 2px solid;
        border-radius: 0.5rem;
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.2s;
        box-sizing: border-box;
        overflow-wrap: break-word;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .gallery-card:hover {
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--muted-foreground);
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .card-header h2 {
        margin: 0;
        font-size: 1.25rem;
        flex: 1;
        word-break: break-word;
    }

    .hours {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 500;
        background: #d4edda;
        color: #155724;
    }

    .media {
        width: 100%;
        aspect-ratio: 16 / 9;
        border-radius: 0.25rem;
        overflow: hidden;
        background: #111;
    }

    .media img,
    .media video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .media-fallback {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #aaa;
        font-size: 0.9rem;
    }

    .description {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.5;
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
        color: var(--foreground);
        font-size: 0.95rem;
        text-decoration: none;
    }

    .slack-user {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        color: var(--foreground);
        font-size: 0.95rem;
        text-decoration: none;
    }

    .slack-avatar {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        object-fit: cover;
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .actions a {
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        font-size: 0.9rem;
    }
</style>
