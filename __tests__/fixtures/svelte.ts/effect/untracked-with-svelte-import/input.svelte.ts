import { getContext } from "svelte";

let s$count: number = 1;
let d$double: number = s$count * 2;

const ctx = getContext<string>("context");

e$: d$double,
	() => {
		console.log(s$count, d$double);
	};
