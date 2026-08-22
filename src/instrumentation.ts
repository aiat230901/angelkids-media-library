export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { bootstrapDatabase } = await import("./server/bootstrap-database");
    await bootstrapDatabase();
  }
}
