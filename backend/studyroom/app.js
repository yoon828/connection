var app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var axios = require("axios");

// localhost:3000으로 서버에 접속하면 클라이언트로 index.html을 전송한다
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// namespace /chat에 접속한다.
var chat = io.of("/chat").on("connection", function (socket) {
  socket.on("connect", function (data) {
    console.log("connect ", data.userId);
    axios.get("localhost:8080/");
    // 유저아이디 스프링에
    // 스터디 방 조회
    // 현재 접속 인원 포함
  });

  socket.on("chat message", function (data) {
    console.log("message from client: ", data);
    console.log(socket.room);

    var name = (socket.name = data.name);
    var room = (socket.room = data.room);

    // room에 join한다
    socket.join(room);
    // room에 join되어 있는 클라이언트에게 메시지를 전송한다
    chat.to(room).emit("chat message", data.msg);
  });
});

server.listen(3000, function () {
  console.log("Socket IO server listening on port 3000");
});
