import { Type, Static } from "@sinclair/typebox";

export const UserPostBodySchema = Type.Object(
  {
    id: Type.String({
      format: "uuid",
      description: "User ID",
    }),
    name: Type.String({
      description: "User Name",
      minLength: 1,
      maxLength: 100,
    }),
    email: Type.String({
      format: "email",
      description: "User Email",
    }),
  },
  {
    $id: "UserPostBody",
    description: "Schema to create a user",
  }
);

export const UserReplySchema = Type.Object(
  {
    id: Type.String({ description: "Unique user identifier" }),
    message: Type.String({ description: "Success message" }),
  },
  {
    $id: "UserReply",
    description: "User creation response",
  }
);

export const UserParamsSchema = Type.Object({
  id: Type.String({
    description: "User ID",
    pattern: "^user-[0-9]+$",
  }),
});

export const UserDetailSchema = Type.Object(
  {
    id: Type.String({ description: "User ID" }),
    name: Type.String({ description: "User name" }),
    age: Type.Number({ description: "User age" }),
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

export type UserPostBody = Static<typeof UserPostBodySchema>;
export type UserReply = Static<typeof UserReplySchema>;
export type UserParams = Static<typeof UserParamsSchema>;
export type UserDetail = Static<typeof UserDetailSchema>;
export type ErrorResponse = Static<typeof ErrorSchema>;
