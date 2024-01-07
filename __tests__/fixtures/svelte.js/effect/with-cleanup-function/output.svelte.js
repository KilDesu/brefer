let s$count = $state(1);

$effect(() => {
	console.log(s$count);

	return () => {
		console.log("cleanup");
	};
});
