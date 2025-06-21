import { z } from 'zod';

export const createOt_masterSchema = z.object({
  body: z.object({
    otName: z.string().min(1, "OT Name is required"),
    slotStatus: z.array(
      z.object({
        slotTime: z.string().min(1, "Slot time is required"),
        status: z.enum(['Available', 'Occupied', 'Maintenance']),
      })
    ),
    floorNumber: z.string().optional(),
    currentStatus: z.enum(['Active', 'Maintenance']),
  }),
});
