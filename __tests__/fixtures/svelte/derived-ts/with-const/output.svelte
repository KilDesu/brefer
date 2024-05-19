<script lang="ts">
	let count: number = $state(1);
	const double: number = $derived(count * 2);
</script>
