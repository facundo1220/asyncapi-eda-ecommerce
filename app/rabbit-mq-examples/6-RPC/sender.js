#!/usr/bin/env node

const amqp = require("amqplib");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: rpc_client.js num");
  process.exit(1);
}

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const correlationId = generateUuid();
  const num = parseInt(args[0]);

  console.log(" [x] Requesting fib(%d)", num);

  const result = await new Promise((resolve) => {
    // Consumir desde la pseudo-cola Direct Reply-to
    channel.consume(
      "amq.rabbitmq.reply-to",
      (msg) => {
        if (msg.properties.correlationId === correlationId) {
          resolve(msg.content.toString());
        }
      },
      { noAck: true },
    );

    // Enviar solicitud RPC
    channel.sendToQueue("rpc_queue", Buffer.from(num.toString()), {
      correlationId: correlationId,
      replyTo: "amq.rabbitmq.reply-to",
    });
  });

  console.log(" [.] Got %s", result);
  await connection.close();
}

// Generar un UUID simple para correlationId
function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}

main();
