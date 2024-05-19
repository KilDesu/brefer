let count: number = $state(1);

function doubleCount() {
  return count * 2;
}

let double: number = $derived(doubleCount());
