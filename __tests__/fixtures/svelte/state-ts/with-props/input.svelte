<script lang="ts">
	let { hello, world }: { hello: string; world: string } = $props();

	var foo: string = "bar";

	let arr: number[] = [1, 2, 3];

	let obj: { foo: string; baz: string } = {
		foo: "bar",
		baz: "qux"
	};
</script>
