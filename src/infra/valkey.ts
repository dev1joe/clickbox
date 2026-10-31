import Redis from "ioredis";

export function createValkeyClient(url: string): Redis {
  const client = new Redis(url, { maxRetriesPerRequest: 3 });

  // Without a listener, connection errors crash the process as unhandled events.
  client.on("error", (err) => {
    console.error("[valkey] connection error:", err.message);
  });

  return client;
}
