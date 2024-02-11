let count: number = 1;

$$(() => {
  console.log(count);

  return () => {
    console.log("cleanup");
  };
});
