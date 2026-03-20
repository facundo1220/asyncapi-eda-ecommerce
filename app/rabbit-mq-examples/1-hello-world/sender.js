const amqp = require("amqplib");

async function send() {
  // Conectar al broker RabbitMQ
  const connection = await amqp.connect("amqp://localhost");

  // Crear un canal
  const channel = await connection.createChannel();

  const queue = "hello"; // Nombre de la cola
  const msg = "Hello World!"; // Mensaje a enviar

  // Asegurar que la cola exista
  await channel.assertQueue(queue, { durable: false });

  // Enviar mensaje a la cola
  channel.sendToQueue(queue, Buffer.from(msg));
  console.log(" [x] Mensaje enviado:", msg);

  // Cerrar conexión después de un momento
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

send();
