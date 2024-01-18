import { getContext, untrack } from "svelte";

let s$count: number = $state(1);
let d$double: number = $derived(s$count * 2);

const ctx = getContext<string>("context");

$effect(() => {
	console.log(
		s$count,
		untrack(() => d$double)
	);
});
