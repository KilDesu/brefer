let count: number = $state(1);

let double: number = $derived.call(function () {
	count * 2;
});
