<script>
	let count = $state(1);

	let double = $derived.call(function () {
		count * 2;
	});
</script>
