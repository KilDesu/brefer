<script>
	let $count = 0;
	let $double = $count * 2;

	$: $double,
		() => {
			console.log($count, $double);
		};
</script>
