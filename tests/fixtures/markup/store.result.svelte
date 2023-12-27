<script>
	import { writable } from "svelte/store";

	let store = writable(1);

	let r$count = $state(1);
	let r$double = $derived(r$count * 2);
</script>

<button on:click={() => r$count++}>
	Count: {r$count}
</button>

<button on:click={() => $store++}>
	Store count: {$store}
</button>
