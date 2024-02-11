let count: number = 1;
let double: number = $(count * 2);

$$(() => {
  console.log(count, $$.active());
});
