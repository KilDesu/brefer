let count: number = $state(1);

$effect.pre(() => {
  console.log(count);

  return () => {
    console.log("cleanup");
  };
});
