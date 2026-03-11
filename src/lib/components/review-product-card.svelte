<script>
	import * as Card from "$lib/components/ui/card/index.js";
	
	export let product;
	export let username;
	export let hoursSpent;
	export let status;

    let displayName = (fetch('https://cachet.dunkirk.sh/users/' + username).then(r => r.json()).then(data => displayName = data.displayName));
</script>

<Card.Root class="w-full p-4 border-2 hover:shadow-lg transition-all duration-200" style="border-color: var(--foreground);">
	<div class="flex items-center justify-between gap-4 ">
		<div class="flex items-center gap-4 flex-1">
			<span class="font-medium" style="color: var(--foreground);">{product}</span>
			<span class="text-muted-foreground">@{displayName || username}</span>
			<span class="text-sm text-muted-foreground">{hoursSpent} hours</span>
		</div>
		<div class="flex-shrink-0">
			<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
				style="background-color: var(--foreground);">
				{status}
			</span>
		</div>
	</div>
</Card.Root>
