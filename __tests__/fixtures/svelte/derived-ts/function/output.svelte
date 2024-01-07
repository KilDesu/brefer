<script lang="ts">
	let s$count: number = $state(1);

	function doubleCount() {
		return s$count * 2;
	}

	let d$double: number = $derived(doubleCount());
</script>
