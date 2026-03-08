import { Type, Static } from "@sinclair/typebox";

export const ManagerPostBodySchema = Type.Object(
  {
    id: Type.String({
      format: "uuid",
      description: "Manager ID",
    }),
    name: Type.String({
      description: "Manager Name",
      minLength: 1,
      maxLength: 100,
    }),
    email: Type.String({
      format: "email",
      description: "Manager Email",
    }),
  },
  {
    $id: "ManagerPostBody",
    description: "Schema to create a manager",
  },
);

export const ManagerParamsSchema = Type.Object({
  id: Type.String({
    description: "Manager ID",
    format: "uuid",
  }),
});

export const ManagerDetailSchema = Type.Object(
  {
    id: Type.String({ description: "Manager ID" }),
    name: Type.String({ description: "Manager name" }),
    email: Type.String({ description: "Manager email" }),
  },
  {
    $id: "ManagerDetail",
    description: "Detailed manager information",
  },
);

export const ErrorManagerSchema = Type.Object(
  {
    error: Type.String({ description: "Error type" }),
    message: Type.String({ description: "Error message" }),
  },
  {
    $id: "ManagerError",
    description: "Error response",
  },
);

export type ManagerPostBody = Static<typeof ManagerPostBodySchema>;
export type ManagerParams = Static<typeof ManagerParamsSchema>;
export type ManagerDetail = Static<typeof ManagerDetailSchema>;
export type ErrorManagerResponse = Static<typeof ErrorManagerSchema>;
