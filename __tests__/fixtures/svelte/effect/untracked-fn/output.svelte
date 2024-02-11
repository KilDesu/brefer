<script>
	import { untrack } from "svelte";
	let count = $state(1);
	let double = $derived(count * 2);

	$effect(() => {
		console.log(
			count,
			untrack(() => double)
		);
	});
</script>
