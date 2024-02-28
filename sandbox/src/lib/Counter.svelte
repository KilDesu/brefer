<script>
	import { Counter } from "./test.svelte.js";

	let counter = new Counter();

	$$(() => {
		console.log(counter.count, counter.double);
	});
</script>

<button onclick={() => counter.increment()}>
	count is {counter.count}, double is {counter.double}
</button>
