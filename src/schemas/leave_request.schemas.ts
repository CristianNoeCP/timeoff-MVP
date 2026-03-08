import { Type, Static } from "@sinclair/typebox";

export const LeaveRequestPostBodySchema = Type.Object(
  {
    id: Type.String({
      format: "uuid",
      description: "Leave Request ID",
    }),
    employeeId: Type.String({
      format: "uuid",
      description: "Employee ID",
    }),
    managerId: Type.String({
      format: "uuid",
      description: "Manager ID",
    }),
    daysDeducted: Type.Number({
      description: "Number of days to deduct from employee's vacation balance",
    }),
  },
  {
    $id: "LeaveRequestPostBody",
    description: "Schema to create a leave request",
  },
);

export const LeaveRequestReplySchema = Type.Object(
  {
    id: Type.String({ description: "Unique leave request identifier" }),
    message: Type.String({ description: "Success message" }),
  },
  {
    $id: "LeaveRequestReply",
    description: "Leave request creation response",
  },
);

export const LeaveRequestParamsSchema = Type.Object({
  id: Type.String({
    description: "Leave Request ID",
    format: "uuid",
  }),
});

export const LeaveRequestDetailSchema = Type.Object(
  {
    id: Type.String({ description: "Leave Request ID" }),
    employeeId: Type.String({ description: "Employee ID" }),
    managerId: Type.String({ description: "Manager ID" }),
    status: Type.String({ description: "Leave request status" }),
    daysDeducted: Type.Number({ description: "Number of days deducted" })
  },
  {
    $id: "LeaveRequestDetail",
    description: "Detailed leave request information",
  },
);

export const ErrorLeaveRequestSchema = Type.Object(
  {
    error: Type.String({ description: "Error type" }),
    message: Type.String({ description: "Error message" }),
  },
  {
    $id: "ErrorLeaveRequest",
    description: "Error response for leave request operations",
  },
);    

export type LeaveRequestPostBody = Static<typeof LeaveRequestPostBodySchema>;
export type LeaveRequestReply = Static<typeof LeaveRequestReplySchema>;
export type LeaveRequestParams = Static<typeof LeaveRequestParamsSchema>;
export type LeaveRequestDetail = Static<typeof LeaveRequestDetailSchema>;
export type ErrorLeaveRequestResponse = Static<typeof ErrorLeaveRequestSchema>;
