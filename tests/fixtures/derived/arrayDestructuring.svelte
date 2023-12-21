<script>
	function pow2(x) {
		return x * x;
	}

	let [$foo, $bar] = [1, 2];

	let [[$doubleFoo, $tripleFoo], $powBar] = [
		[$count * 2, $count * 3],
		pow2($bar),
	];
</script>
