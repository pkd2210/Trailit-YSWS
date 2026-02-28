<script>
    import config from '$lib/stores/config.json';
    let { data } = $props();
    import dotenv from 'dotenv';
    dotenv.config();
</script>

<div class="flex flex-col gap-4">
    <section class="flex flex-col items-center justify-center gap-4">
        <div class="title">{config["ysws-name"]}'s Item Management</div>
        <div class="flex flex-wrap items-center justify-center gap-4">
            <a target="_blank" href="https://dog-match.fillout.com/trailit-itemadd?passkey=${process.env.FILLOUT_PASSKEY}" class="px-4 py-2 bg-[var(--theme-color)] text-[var(--background-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow">Create a new item</a>
        </div>
    </section>
</div>