<script>
	// @ts-nocheck
	let notReactive = true;

	let r$foo = $state("bar");

	let r$count = $state(0);

	let r$object = $state({
		foo: "bar",
		baz: "qux",
	});

	let r$array = $state([1, 2, 3, 4, 5]);
</script>
