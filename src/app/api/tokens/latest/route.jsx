import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 10;

  const tokens = await prisma.token.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return NextResponse.json(tokens);
}
