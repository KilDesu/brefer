let s$count = $state(1);

function doubleCount() {
	return s$count * 2;
}

let d$double = $derived(doubleCount());
