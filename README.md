# TCAP-FrontEnd-Client
Chat App Front End

io.of("/my-namespace").on("connection", (socket) => {
  socket
    .timeout(5000)
    .to("room1")
    .to(["room2", "room3"])
    .except("room4")
    .emit("hello", (err, responses) => {
      // ...
    });
});
