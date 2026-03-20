const amqp = require("amqplib");

async function receive() {
  // Conectar al broker RabbitMQ
  const connection = await amqp.connect("amqp://localhost");

  // Crear un canal
  const channel = await connection.createChannel();

  const queue = "hello"; // Nombre de la cola

  // Asegurar que la cola exista
  await channel.assertQueue(queue, { durable: false });
  console.log(
    " [*] Esperando mensajes en la cola 'hello'. Presiona CTRL+C para salir",
  );

  // Consumir mensajes (auto-ack)
  channel.consume(
    queue,
    (msg) => {
      console.log(" [x] Mensaje recibido:", msg.content.toString());
    },
    { noAck: true },
  ); // auto-ack como en el Tutorial 1
}

receive();
