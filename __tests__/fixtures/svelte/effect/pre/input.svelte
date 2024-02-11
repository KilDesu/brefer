<script>
	let count = 1;

	$$.pre(() => {
		console.log(count);

		return () => {
			console.log("cleanup");
		};
	});
</script>
