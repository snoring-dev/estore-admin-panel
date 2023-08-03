import prismadb from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!body.name) {
      return new NextResponse("Missing field 'name' for store creation", {
        status: 400,
      });
    }

    const store = await prismadb.store.create({
      data: {
        name: body.name,
        logoUrl: body.logoUrl,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (e: any) {
    console.log("[STORE_POST]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
