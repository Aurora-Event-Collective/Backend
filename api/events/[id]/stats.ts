import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../../src/lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string;

  try {
    const stats = await prisma.calendarStat.findMany({ where: { eventId: id } });
    return res.json({ eventId: id, stats });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
