import { Type, Static } from "@sinclair/typebox";

export const OrderPostBodySchema = Type.Object(
  {
    id: Type.String({ format: "uuid", description: "Order ID" }),
    customerId: Type.String({ format: "uuid", description: "Customer ID" }),
    amount: Type.Number({
      minimum: 1,
      maximum: 9999999,
      description: "Order amount",
    }),
    items: Type.Array(
      Type.Object({
        productId: Type.String({ description: "Product ID", format: "uuid" }),
        quantity: Type.Number({
          minimum: 1,
          description: "Quantity of the product",
        }),
      }),
      {
        minItems: 1,
        description: "List of items in the order",
      }
    ),
  },
  {
    $id: "OrderPostBody",
    description: "Schema to create an order",
  }
);

export const OrderParamsSchema = Type.Object({
  id: Type.String({
    description: "Order ID",
    format: "uuid",
  }),
});

export const OrderDetailSchema = Type.Object(
  {
    id: Type.String({ format: "uuid", description: "Order ID" }),
    amount: Type.Number({
      minimum: 1,
      maximum: 9999999,
      description: "Order amount",
    }),
    items: Type.Array(
      Type.Object({
        productId: Type.String({ description: "Product ID" }),
        quantity: Type.Number({
          minimum: 1,
          description: "Quantity of the product",
        }),
      }),
      {
        minItems: 1,
        description: "List of items in the order",
      }
    ),
    status: Type.String({
      description: "Order status",
      enum: ["pending", "completed", "canceled"],
    }),
    createdAt: Type.String({
      format: "date-time",
      description: "Creation timestamp",
    }),
  },
  {
    $id: "UserDetail",
    description: "Detailed user information",
  }
);

export const ErrorSchema = Type.Object(
  {
    error: Type.String({ description: "Error type" }),
    message: Type.String({ description: "Error message" }),
  },
  {
    $id: "Error",
    description: "Error response",
  }
);

export type OrderPostBody = Static<typeof OrderPostBodySchema>;
export type OrderParams = Static<typeof OrderParamsSchema>;
export type OrderDetail = Static<typeof OrderDetailSchema>;
export type ErrorResponse = Static<typeof ErrorSchema>;
