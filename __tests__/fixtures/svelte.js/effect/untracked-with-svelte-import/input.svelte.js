import { getContext } from "svelte";

let s$count = 1;
let d$double = s$count * 2;

const ctx = getContext("context");

e$: d$double,
	() => {
		console.log(s$count, d$double);
	};
