<script lang="ts">
	let count: number = 1;
	let double: number = $(count * 2);

	$$(() => {
		console.log(count, $untrack(double));
	});
</script>
