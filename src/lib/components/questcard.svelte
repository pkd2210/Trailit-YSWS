<script>
    import config from '$lib/stores/config.json';
    
    export let quest;
    export let userSlackId = null;

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function isQuestCompleted() {
        if (!userSlackId || !quest.fields['Users Completed ID']) {
            return false;
        }
        return quest.fields['Users Completed ID'].includes(userSlackId);
    }

    function isQuestRedeemed() {
        if (!userSlackId || !quest.fields['SlackID (from Users Redeemed)']) {
            return false;
        }
        return quest.fields['SlackID (from Users Redeemed)']?.includes(userSlackId);
    }

    function getRewardAmount() {
        return quest.fields['Token Amount'] || 0;
    }

    let isRedeeming = false;

    async function redeemQuest() {
        if (isRedeeming) return; // Prevent multiple simultaneous requests
        
        isRedeeming = true;
        try {
            const response = await fetch('/api/quests/redeem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    questId: quest.id,
                    tokenAmount: getRewardAmount()
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                // Refresh the page or update state
                location.reload();
            } else {
                console.error('Failed to redeem quest:', result.error);
                alert(result.error || 'Failed to redeem quest');
            }
        } catch (error) {
            console.error('Error redeeming quest:', error);
            alert('Error redeeming quest');
        } finally {
            isRedeeming = false;
        }
    }

    function getQuestStatus() {
        const completed = isQuestCompleted();
        const redeemed = isQuestRedeemed();
        
        if (!completed) return 'not-completed';
        if (completed && !redeemed) return 'completed-not-redeemed';
        if (completed && redeemed) return 'completed-redeemed';
        return 'unknown';
    }

    function getStatusClass(status) {
        if (status === 'not-completed') return 'status-not-completed';
        if (status === 'completed-not-redeemed') return 'status-completed';
        if (status === 'completed-redeemed') return 'status-redeemed';
        return 'status-unknown';
    }
</script>

<div class="quest-card" style="border-color: {config['secondary-theme-color']}; background-color: {config['background-color']};">
    <div class="quest-header">
        <h2 style="color: {config['theme-color']};">{quest.fields.Name}</h2>
        <div class="quest-info">
            <span class="reward-amount" style="color: {config['theme-color']};">
                {getRewardAmount()} Tokens
            </span>
            <span class="status {getStatusClass(getQuestStatus())}">
                {#if getQuestStatus() === 'not-completed'}
                    Not Completed
                {:else if getQuestStatus() === 'completed-not-redeemed'}
                    Completed
                {:else if getQuestStatus() === 'completed-redeemed'}
                    Redeemed
                {:else}
                    Unknown
                {/if}
            </span>
        </div>
    </div>
    
    <div class="content">
        {#if quest.fields.Description}
            <p style="color: {config['secondary-theme-color']};" class="description">{quest.fields.Description}</p>
        {/if}
        
    </div>
    
    <div class="actions">
        {#if getQuestStatus() === 'completed-not-redeemed'}
            <button 
                class="redeem-btn" 
                class:redeeming={isRedeeming}
                style="background-color: {config['theme-color']}; color: {config['background-color']};" 
                on:click={redeemQuest}
                disabled={isRedeeming}>
                {#if isRedeeming}
                    Redeeming...
                {:else}
                    Redeem {getRewardAmount()} Tokens
                {/if}
            </button>
        {:else if getQuestStatus() === 'completed-redeemed'}
            <button 
                class="redeem-btn disabled" 
                style="background-color: #e0e0e0; color: #6c757d;" 
                disabled>
                Already Redeemed
            </button>
        {:else if getQuestStatus() === 'not-completed'}
            <button 
                class="redeem-btn disabled" 
                style="background-color: #e0e0e0; color: #6c757d;" 
                disabled>
                Not Completed Yet
            </button>
        {/if}
    </div>
</div>

<style>
    .quest-card {
        border: 2px solid;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.2s;
    }
    
    .quest-card:hover {
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .quest-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--secondary-theme-color, #e0e0e0);
    }

    .quest-header h2 {
        margin: 0;
        font-size: 1.25rem;
        flex: 1;
    }

    .quest-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;
    }

    .reward-amount {
        font-size: 0.9rem;
        font-weight: 600;
    }

    .status {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 500;
        text-transform: capitalize;
    }

    .status-not-completed {
        background: #f8d7da;
        color: #721c24;
    }

    .status-completed {
        background: #fff3cd;
        color: #856404;
    }

    .status-redeemed {
        background: #d4edda;
        color: #155724;
    }

    .status-pending {
        background: #fff3cd;
        color: #856404;
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
    
    .quest-details {
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
        color: #ec3750;
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

    .redeem-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.375rem;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .redeem-btn:not(.disabled):hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .redeem-btn.disabled {
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
    }

    .redeem-btn.redeeming {
        cursor: not-allowed;
        opacity: 0.6;
        transform: none !important;
    }
</style>