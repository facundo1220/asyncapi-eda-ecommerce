const amqp = require("amqplib");

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "topic_logs";
  const args = process.argv.slice(2);

  // routing key: <facility>.<severity>, default 'anonymous.info'
  const key = args.length > 0 ? args[0] : "anonymous.info";
  const msg = args.slice(1).join(" ") || "Hello World!";

  // asegura que el exchange exista
  await channel.assertExchange(exchange, "topic", { durable: false });

  // publica el mensaje al exchange
  channel.publish(exchange, key, Buffer.from(msg));
  console.log(" [x] Sent %s: '%s'", key, msg);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

main();
