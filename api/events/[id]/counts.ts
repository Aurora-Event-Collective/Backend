import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../../src/lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string;
  const platform = req.query.platform as string;

  try {
    const stats = await prisma.calendarStat.findMany({ where: { eventId: id } });

    const counts = stats.reduce(
      (acc, s) => {
        const p = s.platform || 'unknown';
        acc[p] = (acc[p] || 0) + (s.count || 0);
        return acc;
      },
      { google: 0, apple: 0 }
    );

    if (platform && (platform === 'google' || platform === 'apple')) {
      return res.json({ eventId: id, platform, count: counts[platform] });
    }

    return res.json({ eventId: id, counts });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch aggregated counts' });
  }
}
