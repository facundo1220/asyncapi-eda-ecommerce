#!/usr/bin/env node
const amqp = require("amqplib");

async function main() {
  // 1️⃣ Conexión al broker
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "task_queue";
  const msg = process.argv.slice(2).join(" ") || "Hello World!";

  // 2️⃣ Asegurar que la cola exista y sea durable
  await channel.assertQueue(queue, {
    durable: true,
    arguments: { "x-queue-type": "quorum" },
  });

  // 3️⃣ Enviar mensaje persistente
  channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
  console.log(" [x] Sent '%s'", msg);

  // 4️⃣ Cerrar conexión
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

main();
