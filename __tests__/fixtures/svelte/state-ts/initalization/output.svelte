<script lang="ts">
	let s$foo: string = $state("bar");

	let s$arr: number[] = $state([1, 2, 3]);

	let s$obj: { foo: string; baz: string } = $state({
		foo: "bar",
		baz: "qux",
	});
</script>
