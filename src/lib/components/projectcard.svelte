<script>
    import config from '$lib/stores/config.json';
    
    export let project;

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function getProjectName() {
        return project.fields['Project Name'] || 'Untitled Project';
    }

    function getHoursSpent() {
        return project.fields['Optional - Override Hours Spent'] || 'Not specified';
    }

    function getStatus() {
        return project.fields['Automation - Status'] || 'Unknown';
    }

    function getStatusClass(status) {
        if (status?.includes('Pending')) return 'status-pending';
        if (status?.includes('Approved') || status?.includes('Complete')) return 'status-completed';
        if (status?.includes('Rejected') || status?.includes('Denied')) return 'status-rejected';
        return 'status-unknown';
    }
</script>

<div class="project-card" style="border-color: {config['secondary-theme-color']}; background-color: {config['background-color']};">
    <div class="project-header">
        <h2 style="color: {config['theme-color']};">{getProjectName()}</h2>
        <span class="status {getStatusClass(getStatus())}">{getStatus()}</span>
    </div>
    
    <div class="content">
        {#if project.fields.Description}
            <p style="color: {config['secondary-theme-color']};" class="description">{project.fields.Description}</p>
        {/if}
        
        <div class="project-details">
            <div class="detail-row">
                <span class="label">Hours Spent:</span>
                <span class="value">{getHoursSpent()}</span>
            </div>
        </div>
    </div>
    
    <div class="actions">
        {#if project.fields['Code URL']}
            <a href="{project.fields['Code URL']}" target="_blank" 
               style="background-color: {config['theme-color']}; color: {config['background-color']}; text-decoration: none; padding: 0.5rem 1rem; border-radius: 0.25rem; margin-right: 0.5rem; display: inline-block;">
                View Code
            </a>
        {/if}
        
        {#if project.fields['Playable URL']}
            <a href="{project.fields['Playable URL']}" target="_blank" 
               style="background-color: {config['secondary-theme-color']}; color: {config['background-color']}; text-decoration: none; padding: 0.5rem 1rem; border-radius: 0.25rem; display: inline-block;">
                View Project
            </a>
        {/if}
    </div>
</div>

<style>
    .project-card {
        border: 2px solid;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.2s;
    }
    
    .project-card:hover {
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .project-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--secondary-theme-color, #e0e0e0);
    }

    .project-header h2 {
        margin: 0;
        font-size: 1.25rem;
    }

    .status {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 500;
        text-transform: capitalize;
    }

    .status-pending {
        background: #fff3cd;
        color: #856404;
    }

    .status-completed {
        background: #d4edda;
        color: #155724;
    }

    .status-rejected {
        background: #f8d7da;
        color: #721c24;
    }

    .status-unknown {
        background: #e2e3e5;
        color: #383d41;
    }

    .content {
        margin: 1rem 0;
    }
    
    .description {
        margin-bottom: 1rem;
        line-height: 1.5;
    }
    
    .project-details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
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
        color: #333;
        font-size: 0.95rem;
        text-align: right;
        flex: 1;
        margin-left: 1rem;
    }
    
    .actions {
        text-align: right;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--secondary-theme-color, #e0e0e0);
    }
</style>