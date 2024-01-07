<script lang="ts">
	let s$count: number = $state(1);

	$effect(() => {
		console.log(s$count);
	});
</script>
