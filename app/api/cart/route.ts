import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const cart = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(cart);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, quantity } = await req.json();

    const existing = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: {
          id: existing.id,
        },
        data: {
          quantity: existing.quantity + quantity,
        },
      });

      return NextResponse.json(updated);
    }

    const cart = await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        productId,
        quantity,
      },
    });

    return NextResponse.json(cart);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to add cart item" },
      { status: 500 }
    );
  }
}