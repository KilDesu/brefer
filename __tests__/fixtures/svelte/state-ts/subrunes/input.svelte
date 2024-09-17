<script lang="ts">
	let normalState: number = 0;
	let raw: ["foo", "bar", "baz"] = $raw(["foo", "bar", "baz"]);

	console.log($snapshot(normalState));
</script>
