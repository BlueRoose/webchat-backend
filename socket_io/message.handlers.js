const Message = require("../models/message.model");
const onError = require("../utils/onError");

// "хранилище" для сообщений
const messages = {};

function messageHandlers(io, socket) {
  // извлекаем идентификатор комнаты
  const { roomId } = socket;

  // утилита для обновления списка сообщений
  const updateMessageList = () => {
    io.to(roomId).emit("message-list:update", messages[roomId]);
  };

  // обрабатываем получение сообщений
  socket.on("message:get", async () => {
    try {
      // получаем сообщения по `id` комнаты
      const _messages = await Message.find({
        roomId,
      });
      // инициализируем хранилище сообщений
      messages[roomId] = _messages;

      // обновляем список сообщений
      updateMessageList();
    } catch (e) {
      onError(e);
    }
  });

  // обрабатываем создание нового сообщения
  socket.on("message:add", (message) => {
    // пользователи не должны ждать записи сообщения в БД
    Message.create(message).catch(onError);

    // это нужно для клиента
    message.createdAt = Date.now();

    // создаем сообщение оптимистически,
    // т.е. предполагая, что запись сообщения в БД будет успешной
    messages[roomId].push(message);

    // обновляем список сообщений
    updateMessageList();
  });

  // обрабатываем удаление сообщения
  socket.on("message:remove", (message) => {
    const { messageId } = message;

    // пользователи не должны ждать удаления сообщения из БД
    // и файла на сервере (если сообщение является файлом)
    Message.deleteOne({ messageId })
      .then(() => {
      })
      .catch(onError);

    // удаляем сообщение оптимистически
    messages[roomId] = messages[roomId].filter(
      (m) => m.messageId !== messageId
    );

    // обновляем список сообщений
    updateMessageList();
  });
}

module.exports = messageHandlers;
