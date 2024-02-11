<script lang="ts">
	let count: number = $state(1);

	$effect(() => {
		console.log(count);
	});
</script>
