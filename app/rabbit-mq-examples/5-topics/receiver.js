const amqp = require("amqplib");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: receive_logs_topic.js <binding_key> [<binding_key>...]");
  process.exit(1);
}

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "topic_logs";

  // asegura que el exchange exista
  await channel.assertExchange(exchange, "topic", { durable: false });

  // cola temporal exclusiva para este consumidor
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(" [*] Waiting for logs. To exit press CTRL+C");

  // vincula la cola a cada binding key
  for (const key of args) {
    await channel.bindQueue(q.queue, exchange, key);
  }

  // recibe los mensajes que coincidan con las binding keys
  channel.consume(
    q.queue,
    (msg) => {
      console.log(
        " [x] %s:'%s'",
        msg.fields.routingKey,
        msg.content.toString(),
      );
    },
    { noAck: true },
  );
}

main();
