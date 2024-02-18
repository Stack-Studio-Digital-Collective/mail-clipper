import("./copy.js")
  .then((module) => {
    console.log("Copy script loaded as module");
  })
  .catch((err) => {
    console.error("Failed to load copy script as module");
    console.error(err);
  });
