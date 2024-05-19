let count: number = $state(1);

$effect(() => {
  console.log(count);

  return () => {
    console.log("cleanup");
  };
});
