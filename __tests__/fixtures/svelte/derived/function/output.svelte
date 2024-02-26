<script>
	let count = $state(1);

	function doubleCount() {
		return count * 2;
	}

	let double = $derived.by(doubleCount);
</script>
