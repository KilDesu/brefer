<script>
	import { untrack } from "svelte";

	let r$count = $state(0);
	let r$double = $derived(r$count * 2);

	$effect(() => {
		console.log(
			r$count,
			untrack(() => r$double)
		);
	});
</script>
