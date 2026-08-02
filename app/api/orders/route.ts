import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      address,
      items,
      subtotal,
      shipping,
      total,
    } = body;

    if (!userId || !items?.length) {
      return NextResponse.json(
        { message: "Invalid order data" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        userId,
        subtotal,
        shipping,
        total,
        status: "PENDING",
        paymentStatus: "PENDING",

        items: {
          create: items.map((item: any) => ({
            productId: item.product.id,
            productName: item.product.name,
            productImage: item.product.image,
            price: item.product.price,
            quantity: item.quantity,
          })),
        },
      },

      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
      },
      {
        status: 500,
      }
    );
  }
}