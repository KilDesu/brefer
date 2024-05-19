<script lang="ts">
	let count: number = 1;

	let cleanup = $$.root(() => {
		console.log(count);

		return () => {
			console.log("cleanup");
		};
	});
</script>
