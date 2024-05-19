<script lang="ts">
	import { untrack } from "svelte";
	let count: number = $state(1);
	let double: number = $derived(count * 2);

	$effect(() => {
		console.log(
			count,
			untrack(() => double)
		);
	});
</script>
