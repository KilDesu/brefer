<script>
	let $count = 1;
	let $double = $count * 2;
</script>

<button on:click={() => $count++}>
	Count: {$count}
</button>
Double is {$double}
