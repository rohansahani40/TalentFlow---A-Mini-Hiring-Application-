export async function simulateNetwork() {
  const delay = Math.floor(Math.random() * 1000) + 200; // 200–1200ms
  await new Promise((r) => setTimeout(r, delay));

  // 7% chance of error
  if (Math.random() < 0.07) {
    throw new Error("Simulated server error");
  }
}
