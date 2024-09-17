<script lang="ts">
	let normalState: number = $state(0);
	let raw: ["foo", "bar", "baz"] = $state.raw(["foo", "bar", "baz"]);

	$inspect($state.snapshot(normalState));
</script>
