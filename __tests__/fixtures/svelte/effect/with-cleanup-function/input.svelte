<script>
	let count = 1;

	$$(() => {
		console.log(count);

		return () => {
			console.log("cleanup");
		};
	});
</script>
