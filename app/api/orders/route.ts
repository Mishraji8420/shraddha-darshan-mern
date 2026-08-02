import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Get logged-in user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Read request body
    const body = await req.json();

    const {
      address,
      items,
      subtotal,
      shipping,
      total,
    } = body;

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty",
        },
        {
          status: 400,
        }
      );
    }

    // Create Order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,

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
      message: "Order created successfully",
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