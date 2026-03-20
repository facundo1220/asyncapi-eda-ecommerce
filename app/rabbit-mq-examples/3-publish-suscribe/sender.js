const amqp = require("amqplib");

async function main() {
  // Conexión a RabbitMQ
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "logs";
  const msg = process.argv.slice(2).join(" ") || "Hello World!";

  // Declaramos un exchange de tipo fanout (para broadcast)
  await channel.assertExchange(exchange, "fanout", { durable: false });

  // Publicamos el mensaje en el exchange
  channel.publish(exchange, "", Buffer.from(msg));
  console.log(" [x] Sent %s", msg);

  // Cerramos la conexión después de un pequeño delay
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

main();
