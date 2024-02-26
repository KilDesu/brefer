let count = $state(1);

let double = $derived.by(function () {
	count * 2;
});
