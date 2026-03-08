import { Type, Static } from "@sinclair/typebox";

export const EmployeePostBodySchema = Type.Object(
  {
    id: Type.String({
      format: "uuid",
      description: "Employee ID",
    }),
    name: Type.String({
      description: "Employee Name",
      minLength: 1,
      maxLength: 100,
    }),
    email: Type.String({
      format: "email",
      description: "Employee Email",
    }),
    managerId: Type.String(
      Type.String({
        format: "uuid",
        description: "Manager ID (optional)",
      }),
    ),
  },
  {
    $id: "EmployeePostBody",
    description: "Schema to create an employee",
  },
);

export const EmployeeParamsSchema = Type.Object({
  id: Type.String({
    description: "Employee ID",
    format: "uuid",
  }),
});

export const EmployeeDetailSchema = Type.Object(
  {
    id: Type.String({ description: "Employee ID" }),
    name: Type.String({ description: "Employee name" }),
    email: Type.String({ description: "Employee email" }),
    managerId: Type.Optional(
      Type.String({ description: "Manager ID (optional)", format: "uuid" }),
    ),
    availableVacationDays: Type.Number({
      description: "Available vacation days",
    }),
  },
  {
    $id: "EmployeeDetail",
    description: "Detailed employee information",
  },
);

export const ErrorEmployeeSchema = Type.Object(
  {
    error: Type.String({ description: "Error type" }),
    message: Type.String({ description: "Error message" }),
  },
  {
    $id: "Error",
    description: "Error response",
  },
);

export type EmployeePostBody = Static<typeof EmployeePostBodySchema>;
export type EmployeeParams = Static<typeof EmployeeParamsSchema>;
export type EmployeeDetail = Static<typeof EmployeeDetailSchema>;
export type ErrorEmployeeResponse = Static<typeof ErrorEmployeeSchema>;
