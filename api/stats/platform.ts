import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../src/lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const stats = await prisma.calendarStat.findMany();

    const counts = stats.reduce((acc, s) => {
      const p = s.platform || 'unknown';
      acc[p] = (acc[p] || 0) + (s.count || 0);
      return acc;
    }, { google: 0, apple: 0 });

    return res.json({ counts });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch global counts' });
  }
}
