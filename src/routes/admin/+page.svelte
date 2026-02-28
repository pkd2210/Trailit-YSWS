<script>
    import config from '$lib/stores/config.json';
    let { data } = $props();
</script>

<div class="flex flex-col gap-4">
    <section class="flex flex-col items-center justify-center gap-4">
        <div class="title">{config["ysws-name"]}'s Admin Panel</div>
        <div class="flex flex-wrap items-center justify-center gap-4">
            <a href="{config['url-base']}/admin/users" class="px-4 py-2 bg-[var(--theme-color)] text-[var(--background-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow">Manage Users</a>
        </div>
    </section>
</div>