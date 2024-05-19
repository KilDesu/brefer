let { hello, world }: { hello: string; world: string } = $props();

let foo: string = "bar";

let arr: number[] = $state([1, 2, 3]);

let obj: { foo: string; baz: string } = $state({
  foo: "bar",
  baz: "qux",
});
