let count = 1;

let cleanup = $$.root(() => {
  console.log(count);

  return () => {
    console.log("cleanup");
  };
});
