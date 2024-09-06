// src/models/ProfileFormSchema.ts

import logger from '@/lib/logger';
import { z } from 'zod';

const profileFormSchema = z.object({
  userId: z.string(),
  name: z.string(),
  profile: z.object({
    age: z
      .string()
      .transform((val, ctx) => {
        const age = parseFloat(val);
        if (age < 8 || age > 99) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Age must be between 8 and 99',
          });
          return z.NEVER;
        }
        return age;
      })
      .optional(),

    gender: z
      .enum(['male', 'female', 'other'])
      .optional()
      .catch((ctx) => {
        logger.debug(
          'catch error: ',
          ctx.error,
          'there is no need to validate an optional field when it is a select field'
        );
        return 'other';
      })
      .default('other'),
    weight: z
      .string()
      .transform((val, ctx) => {
        const weight = parseFloat(val);
        if (weight < 1 || weight > 600) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Weight must be between 1 and 600',
          });
          return z.NEVER;
        }
        return weight;
      })
      .optional(),

    height: z
      .string()
      .transform((val, ctx) => {
        const height = parseFloat(val);
        if (height < 1 || height > 300) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Height must be between 100 and 250',
          });
          return z.NEVER;
        }
        return height;
      })
      .optional(),
    bodyFat: z
      .string()
      .transform((val, ctx) => {
        const bodyFat = parseFloat(val);
        if (bodyFat < 1 || bodyFat > 50) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Body Fat must be between 1 and 50',
          });
          return z.NEVER;
        }
        return bodyFat;
      })
      .optional(),
  }),
});

export { profileFormSchema };
