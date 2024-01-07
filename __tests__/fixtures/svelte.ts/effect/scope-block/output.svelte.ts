let s$count: number = $state(1);

$effect(() => {
	console.log(s$count);
});
