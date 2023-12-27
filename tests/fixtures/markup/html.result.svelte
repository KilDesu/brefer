<script>
	let r$count = $state(1);
	let r$double = $derived(r$count * 2);
</script>

<button on:click={() => r$count++}>
	Count: {r$count}
</button>
Double is {r$double}
