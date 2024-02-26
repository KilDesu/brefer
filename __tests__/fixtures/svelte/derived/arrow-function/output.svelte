<script>
	let count = $state(1);

	let double = $derived.by(() => count * 2);
</script>
