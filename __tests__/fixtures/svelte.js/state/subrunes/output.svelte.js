let normalState = $state(0);
let raw = $state.raw(["foo", "bar", "baz"]);

console.log($state.snapshot(normalState));
