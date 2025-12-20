import { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../../../src/lib/prisma.js'
import { apiHandler } from '../../../src/lib/apiHandler.js'

type Platform = 'google' | 'apple'

async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel populates req.query.id from [id] in the path
  const id = (req.query.id as string) || (req as any).url?.split('/')[3]
  const platform = req.query.platform as Platform | undefined

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Event ID is required' })
  }

  const stats = await prisma.calendarStat.findMany({ where: { eventId: id } })

  const counts = stats.reduce(
    (acc, s) => {
      if (s.platform === 'google' || s.platform === 'apple') {
        acc[s.platform] += s.count ?? 0
      }
      return acc
    },
    { google: 0, apple: 0 }
  )

  if (platform && (platform === 'google' || platform === 'apple')) {
    return res.json({ eventId: id, platform, count: counts[platform] })
  }

  return res.json({ eventId: id, counts })
}

export default apiHandler(handler)
