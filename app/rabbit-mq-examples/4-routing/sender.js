const amqp = require("amqplib");

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "direct_logs";
  const args = process.argv.slice(2);
  const severity = args.length > 0 ? args[0] : "info"; // info, warning, error
  const msg = args.slice(1).join(" ") || "Hello World!";

  // Declaramos el exchange tipo 'direct'
  await channel.assertExchange(exchange, "direct", { durable: false });

  // Publicamos mensaje con routing key = severity
  channel.publish(exchange, severity, Buffer.from(msg));
  console.log(" [x] Sent %s: '%s'", severity, msg);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

main();
