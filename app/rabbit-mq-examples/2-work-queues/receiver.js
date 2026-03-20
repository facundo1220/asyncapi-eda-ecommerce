#!/usr/bin/env node
const amqp = require("amqplib");

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "task_queue";

  // Aseguramos que la cola exista
  await channel.assertQueue(queue, {
    durable: true,
    arguments: { "x-queue-type": "quorum" },
  });

  // Prefetch 1 → solo un mensaje por worker a la vez
  channel.prefetch(1);

  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

  // Consumir mensajes
  channel.consume(
    queue,
    (msg) => {
      const secs = msg.content.toString().split(".").length - 1; // "." = segundos de trabajo

      console.log(" [x] Received '%s'", msg.content.toString());
      setTimeout(() => {
        console.log(" [x] Done");
        channel.ack(msg); // ack manual después de procesar
      }, secs * 1000);
    },
    { noAck: false },
  ); // manual acknowledgment
}

main();
