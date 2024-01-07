<script>
	let s$count = 1;

	e$: () => {
		console.log(s$count);

		return () => {
			console.log("cleanup");
		};
	};
</script>
