<script>
	class Foo {
		r$count = $state(1);
		r$double = $derived(this.r$count * 2);
	}
</script>
