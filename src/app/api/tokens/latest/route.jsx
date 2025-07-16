import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  const tokens = await prisma.token.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return NextResponse.json(tokens);
}
