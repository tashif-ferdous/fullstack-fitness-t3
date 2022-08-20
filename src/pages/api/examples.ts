// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const lifts = async (req: NextApiRequest, res: NextApiResponse) => {
  const lifts = await prisma.lift.findMany();
  res.status(200).json(lifts);
};

export default lifts;