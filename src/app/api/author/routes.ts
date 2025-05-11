import { readSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const authors: any[] = [];
  return res.status(200).json(authors);
}
