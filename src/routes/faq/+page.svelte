<script lang="ts">
    import config from '$lib/stores/config.json';
    import * as Collapsible from "$lib/components/ui/collapsible/index.js";
    import { ChevronDown } from "@lucide/svelte";

    // FAQ Data - customize these questions and answers
    const faqData = [
        {
            question: "What is TrailIt?",
            answer: "TrailIt is a Hack Club event where you'll build a web-app project, then produce a trailer / showcase video for it. <br> And then you'll recive clappboards, and buy production equipment with them in the <a href='/shop'><u>shop</u></a>!"
        },
        {
            question: "How do I earn clappboards?",
            answer: "Clappboards can be Earned thorugh 2 ways: <br> 1. Completing <a href='/quests'><u>quests</u></a> <br> 2. Submitting projects"
        },
        {
            question: "What is the calculation for clappboards?",
            answer: "You earn Clappboards based on a formula of rating we have * hours you did.<br>We have 2 formulas, 1 for products, and one for videos."
        },
        {
            question: "How long will TrailIt run?",
            answer: "TrailIt will run for 2 monthes (With expension maybe availdable), from March 15th, to May 15th"
        },
    ];

    let openItems: { [key: number]: boolean } = {};

    $: {
        faqData.forEach((_, index) => {
            if (!(index in openItems)) {
                openItems[index] = false;
            }
        });
    }
</script>

<div class="faq-container">
    <section class="faq-header">
        <div class="title">Frequently Asked Questions</div>
        <div class="subtitle">Find answers to common questions about {config["ysws-name"]}</div>
    </section>

    <section class="faq-content">
        <div class="faq-items">
            {#each faqData as faq, index}
                <div class="faq-item">
                    <Collapsible.Root bind:open={openItems[index]}>
                        <Collapsible.Trigger class="faq-question">
                            <span class="faq-question-text">{faq.question}</span>
                            <ChevronDown 
                                class="faq-chevron {openItems[index] ? 'faq-chevron-open' : ''}" 
                                size={20} 
                            />
                        </Collapsible.Trigger>
                        <Collapsible.Content class="faq-answer">
                            <div class="faq-answer-content">
                                <p>{@html faq.answer}</p>
                            </div>
                        </Collapsible.Content>
                    </Collapsible.Root>
                </div>
            {/each}
        </div>
    </section>

    <!-- Contact Section -->
    <section class="faq-contact">
        <div class="contact-card">
            <h3>Still have questions?</h3>
            <p>Can't find what you're looking for? Reach out to our community!</p>
            <a 
                href="https://hackclub.enterprise.slack.com/archives/C0AGG8J6PLL" 
                target="_blank" 
                class="contact-button"
            >
                Join #trailit-ysws on Slack
            </a>
        </div>
    </section>
</div>

<style>
    .faq-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .faq-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .faq-content {
        margin-bottom: 3rem;
    }

    .faq-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .faq-item {
        border: 2px solid var(--secondary-theme-color);
        border-radius: 0.5rem;
        background-color: var(--background-color);
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .faq-item:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
    }

    :global(.faq-question) {
        width: 100%;
        padding: 1.25rem;
        background: transparent;
        border: none;
        text-align: left;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.3s ease;
        color: var(--theme-color);
    }

    :global(.faq-question:hover) {
        background-color: rgba(236, 55, 80, 0.1);
    }

    .faq-question-text {
        font-size: 1.1rem;
        font-weight: 600;
        font-family: "Phantom Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    :global(.faq-chevron) {
        color: var(--theme-color);
        transition: transform 0.3s ease;
        flex-shrink: 0;
    }

    :global(.faq-chevron-open) {
        transform: rotate(180deg);
    }

    :global(.faq-answer) {
        overflow: hidden;
    }

    .faq-answer-content {
        padding: 0 1.25rem 1.25rem 1.25rem;
        color: var(--secondary-theme-color);
        line-height: 1.6;
        font-size: 1rem;
    }

    .faq-answer-content p {
        margin: 0;
    }

    .faq-contact {
        margin-top: 4rem;
    }

    .contact-card {
        text-align: center;
        padding: 2rem;
        border: 2px solid var(--secondary-theme-color);
        border-radius: 0.5rem;
        background: linear-gradient(135deg, var(--background-color) 0%, rgba(236, 55, 80, 0.05) 100%);
    }

    .contact-card h3 {
        color: var(--theme-color);
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        font-family: "Phantom Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .contact-card p {
        color: var(--secondary-theme-color);
        margin-bottom: 1.5rem;
        font-size: 1rem;
    }

    .contact-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        background-color: var(--theme-color);
        color: var(--background-color);
        text-decoration: none;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        font-family: "Phantom Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .contact-button:hover {
        background-color: var(--secondary-theme-color);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .faq-container {
            padding: 1rem 0.5rem;
        }

        .faq-header {
            margin-bottom: 2rem;
        }

        .faq-question-text {
            font-size: 1rem;
        }

        .faq-answer-content {
            font-size: 0.9rem;
        }

        .contact-card {
            padding: 1.5rem;
        }

        .contact-card h3 {
            font-size: 1.3rem;
        }
    }

    @media (max-width: 480px) {
        .faq-container {
            padding: 1rem 0.25rem;
        }

        :global(.faq-question) {
            padding: 1rem;
        }

        .faq-answer-content {
            padding: 0 1rem 1rem 1rem;
        }
    }
</style>