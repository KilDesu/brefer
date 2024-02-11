<script lang="ts">
	let count: number = 1;

	$$.pre(() => {
		console.log(count);

		return () => {
			console.log("cleanup");
		};
	});
</script>
