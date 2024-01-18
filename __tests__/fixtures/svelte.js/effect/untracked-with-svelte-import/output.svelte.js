import { getContext, untrack } from "svelte";

let s$count = $state(1);
let d$double = $derived(s$count * 2);

const ctx = getContext("context");

$effect(() => {
	console.log(
		s$count,
		untrack(() => d$double)
	);
});
