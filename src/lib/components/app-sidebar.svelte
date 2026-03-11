<script lang="ts" module>
	import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
	import HomeIcon from "@lucide/svelte/icons/home";
	import ShoppingCartIcon from "@lucide/svelte/icons/shopping-cart";
	import TrophyIcon from "@lucide/svelte/icons/trophy";
	import SendHorizontal from "@lucide/svelte/icons/send-horizontal";
	import Clapperboard from "@lucide/svelte/icons/clapperboard";
	import { Separator } from "$lib/components/ui/separator/index.js";
</script>

<script lang="ts">
	import NavMain from "./nav-main.svelte";
	import NavUser from "./nav-user.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { ComponentProps } from "svelte";
	import config from '$lib/stores/config.json';

	let {
		data,
		ref = $bindable(null),
		collapsible = "icon",
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { data: any } = $props();

	// Create sidebar navigation based on user state
	const sidebarData = $derived({
		user: data.user ? {
			name: data.user.first_name || "User",
			email: data.user.email || "",
			avatar: "https://cachet.dunkirk.sh/users/" + (data.user.slack_id || "default") + "/r",
		} : null,
		navMain: [
			{
				title: "Home",
				url: config['url-base'],
				icon: HomeIcon,
				isActive: true,
			},
			{
				title: "Shop",
				url: `${config['url-base']}/shop`,
				icon: ShoppingCartIcon,
				items: [
					{
						title: "Browse Items",
						url: `${config['url-base']}/shop`,
					},
					...(data.user ? [{
						title: "Orders",
						url: `${config['url-base']}/shop/orders`,
					}] : []),
					...(data.user ? [{
						title: "Projects",
						url: `${config['url-base']}/shop/projects`,
					}] : []),
					
				],
			},
			...(data.user ? [{
				title: "Quests",
				url: `${config['url-base']}/quests`,
				icon: TrophyIcon,
			}] : []),
			...(data.user ? [{
				title: "Submit",
				icon: SendHorizontal,
				items: [
					{
						title: "Submit Product",
						url: `${config['url-base']}/submit/product`,
					},
					{
						title: "Submit Video",
						url: `${config['url-base']}/submit/video`,
					},
				],
			}] : []),
			{
				title: "FAQ",
				url: `${config['url-base']}/faq`,
				icon: GalleryVerticalEndIcon,
			},
			...(data.user?.Reviewer ? [{
				title: "Review Submissions",
				icon: Clapperboard,
				items: [
					{
						title: "Products",
						url: `${config['url-base']}/review/products`,
					},
					{
						title: "Videos",
						url: `${config['url-base']}/review/videos`,
					},
				],
			}] : []),
		],
	});
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<a href={config['url-base']}>
			<div class="flex items-center gap-3 px-4 py-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
					<Clapperboard class="h-6 w-6" />
				</div>
				<div class="flex flex-col">
					<span class="text-lg font-semibold">TrailIt YSWS</span>
				</div>
			</div>
		</a>
	</Sidebar.Header>
	<Sidebar.Content>
		<Separator style="background-color: #ec3750;"/>
		<NavMain items={sidebarData.navMain} />
	</Sidebar.Content>
	<Separator style="background-color: #ec3750;"/>
	<Sidebar.Footer>
		{#if sidebarData.user}
			<NavUser user={sidebarData.user} data={data}/>
		{:else}
			<div class="px-3 py-2">
				<a href="{config['url-base']}/api/login" class="text-md text-red-500 hover:underline font-large text-center">Login</a>
			</div>
		{/if}
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
