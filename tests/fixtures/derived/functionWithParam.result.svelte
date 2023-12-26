<script>
	// @ts-nocheck
	function double(count) {
		return count * 2;
	}

	let r$count = $state(1);
	let r$double = $derived(double(r$count));
</script>
