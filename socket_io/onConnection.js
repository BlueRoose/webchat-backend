const { userHandlers } = require("./user.handlers.js");
const messageHandlers = require("./message.handlers.js");

function onConnection(io, socket) {
  // извлекаем идентификатор комнаты и имя пользователя
  const { roomId, userName } = socket.handshake.query;

  // записываем их в объект сокета
  socket.roomId = roomId;
  socket.userName = userName;

  // присоединяемся к комнате
  socket.join(roomId);

  // регистрируем обработчики для пользователей
  userHandlers(io, socket);

  // регистрируем обработчики для сообщений
  messageHandlers(io, socket);
}

module.exports = onConnection;
