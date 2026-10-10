import { prisma } from "@/lib/prisma";

export async function aiLog(action: string, input: unknown, output: unknown) {
  await prisma.aiLog.create({
    data: {
      action,
      input: JSON.stringify(input).slice(0, 8000),
      output: JSON.stringify(output).slice(0, 8000),
    },
  });
}
