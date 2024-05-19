<script lang="ts">
	let count: number = $state(1);
	let double: number = $derived(count * 2);
</script>
