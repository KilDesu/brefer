let count: number = $state(1);

let cleanup = $effect.root(() => {
  console.log(count);

  return () => {
    console.log("cleanup");
  };
});
