const amqp = require("amqplib");

async function main() {
  // Conexión a RabbitMQ
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "logs";

  // Declaramos el exchange (fanout)
  await channel.assertExchange(exchange, "fanout", { durable: false });

  // Creamos una cola temporal exclusiva con nombre generado por el servidor
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

  // Vinculamos la cola al exchange
  channel.bindQueue(q.queue, exchange, "");

  // Consumimos mensajes
  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        console.log(" [x] %s", msg.content.toString());
      }
    },
    { noAck: true },
  );
}

main();
