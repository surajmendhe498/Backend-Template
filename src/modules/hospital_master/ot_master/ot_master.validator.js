// import { z } from 'zod';

// export const createOt_masterSchema = z.object({
//   body: z.object({
//     otName: z.string().min(1, "OT Name is required"),
//     slotStatus: z.array(
//       z.object({
//         slotTime: z.string().min(1, "Slot time is required"),
//         status: z.enum(['Available', 'Occupied', 'Maintenance']),
//       })
//     ),
//     floorNumber: z.string().optional(),
//     currentStatus: z.enum(['Active', 'Maintenance']),
//   }),
// });



import { z } from 'zod';

const slotSchema = z.object({
  slotTime: z.string().nonempty("Slot time is required"),
  status: z.enum(['Available', 'Occupied', 'Maintenance']),
});

export const createOt_masterSchema = z.object({
  body: z.object({
    otName: z.string().nonempty("OT name is required"),
    slotStatus: z.array(slotSchema),
    floorId: z.string().nonempty("Floor ID is required").regex(/^[0-9a-fA-F]{24}$/, "Invalid Floor ID"),
    currentStatus: z.enum(['Active', 'Maintenance']),
  }),
});

export const updateOt_masterSchema = z.object({
  body: z.object({
    otName: z.string().optional(),
    slotStatus: z.array(slotSchema).optional(),
    floorId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Floor ID").optional(),
    currentStatus: z.enum(['Active', 'Maintenance']).optional(),
  }),
  params: z.object({
    id: z.string().min(1, "OT Master ID is required"),
  }),
});
