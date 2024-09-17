let normalState = $state(0);
let raw = $state.raw(["foo", "bar", "baz"]);

$inspect($state.snapshot(normalState));
