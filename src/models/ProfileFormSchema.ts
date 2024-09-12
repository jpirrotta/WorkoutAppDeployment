// src/models/ProfileFormSchema.ts

import { z } from 'zod';

const profileFormSchema = z.object({
  userId: z.string(),
  name: z.string(),
  profile: z.object({
    age: z.coerce
      .number({ message: 'Age must be between 8-99' })
      .min(1)
      .max(99)
      .optional(),

    gender: z.enum(['male', 'female', 'other']).optional().default('other'),
    weight: z.coerce
      .number({ message: 'Weight must be between 1-300' })
      .min(1)
      .max(300)
      .optional(),

    height: z.coerce
      .number({ message: 'Height must be between 1-300' })
      .min(1)
      .max(300)
      .optional(),
    bodyFat: z.coerce
      .number({ message: 'Must be between 1-50' })
      .min(1)
      .max(50)
      .optional(),
  }),
});

export { profileFormSchema };
