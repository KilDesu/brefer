let count: number = $state(1);
let double: number = $derived.by(() => count * 2);
