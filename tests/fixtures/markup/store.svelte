<script>
	import { writable } from "svelte/store";

	let store = writable(1);

	let $count = 1;
	let $double = $count * 2;
</script>

<button on:click={() => $count++}>
	Count: {$count}
</button>

<button on:click={() => $store++}>
	Store count: {$store}
</button>
