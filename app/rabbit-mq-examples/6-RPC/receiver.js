#!/usr/bin/env node

const amqp = require("amqplib");

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "rpc_queue";

  // Declarar la cola RPC
  await channel.assertQueue(queue, {
    durable: true,
    arguments: { "x-queue-type": "quorum" },
  });

  // Para balancear la carga si hay múltiples servidores
  channel.prefetch(1);

  console.log(" [x] Awaiting RPC requests");

  channel.consume(queue, function reply(msg) {
    const n = parseInt(msg.content.toString());
    console.log(" [.] fib(%d)", n);

    const r = fibonacci(n);

    // Enviar la respuesta al cliente usando replyTo
    channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
      correlationId: msg.properties.correlationId,
    });

    // Confirmar mensaje recibido
    channel.ack(msg);
  });
}

// Función Fibonacci
function fibonacci(n) {
  if (n === 0 || n === 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

main();
