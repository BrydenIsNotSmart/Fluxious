export async function getCPUPercent(): Promise<number> {
  const startUsage = process.cpuUsage();
  const startTime = process.hrtime.bigint();

  await new Promise((resolve) => setTimeout(resolve, 100));

  const endUsage = process.cpuUsage(startUsage);
  const endTime = process.hrtime.bigint();

  const elapsedTimeMS = Number(endTime - startTime) / 1e6;
  const cpuTimeMS = (endUsage.user + endUsage.system) / 1000;

  return (cpuTimeMS / elapsedTimeMS) * 100;
}
