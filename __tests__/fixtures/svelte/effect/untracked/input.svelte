<script>
	let s$count = 1;
	let d$double = s$count * 2;

	e$: d$double,
		() => {
			console.log(s$count, d$double);
		};
</script>
