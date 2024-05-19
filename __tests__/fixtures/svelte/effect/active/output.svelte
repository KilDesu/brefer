<script>
	let count = $state(1);
	let double = $derived(count * 2);

	$effect(() => {
		console.log(count, $effect.active());
	});
</script>
