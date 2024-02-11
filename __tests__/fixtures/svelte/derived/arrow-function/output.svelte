<script>
	let count = $state(1);

	let double = $derived.call(() => count * 2);
</script>
