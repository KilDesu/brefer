let s$count: number = $state(1);
let d$double: number = $derived(s$count * 2);

$effect(() => {
	console.log(s$count);
});
