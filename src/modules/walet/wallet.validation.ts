import z from "zod";

export const sendMoneyZodSchema = z.object({
  receiverPhone: z
    .string({ error: "Phone number is required" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
  amount: z
    .number({ error: "Amount is required" })
    .min(20, "Amount must be at least 20"),
  password: z
    .string({ error: "Password is required" })
    .min(5, "Password must be at least 5 digits")
    .max(20, "Password must be exactly 20 digits")
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }),
});

export const cashOutZodSchema = z.object({
  agentPhone: z
    .string({ error: "Phone number is required" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
  amount: z
    .number({ error: "Amount is required" })
    .min(50, "Amount must be at least 50"),
  password: z
    .string({ error: "Password is required" })
    .min(5, "Password must be at least 5 digits")
    .max(20, "Password must be exactly 20 digits")
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }),
});

export const cashInZodSchema = z.object({
  receiverPhone: z
    .string({ error: "Phone number is required" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
  amount: z
    .number({ error: "Amount is required" })
    .min(50, "Amount must be at least 50"),
  password: z
    .string({ error: "Password is required" })
    .min(5, "Password must be at least 5 digits")
    .max(20, "Password must be exactly 20 digits")
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }),
});