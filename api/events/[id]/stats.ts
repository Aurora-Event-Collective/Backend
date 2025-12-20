import { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../../../src/lib/prisma.js'
import { apiHandler } from '../../../src/lib/apiHandler.js'

async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel populates req.query.id from [id] in the path
  const id = (req.query.id as string) || (req as any).url?.split('/')[3]

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Event ID is required' })
  }

  const stats = await prisma.calendarStat.findMany({ where: { eventId: id } })
  return res.json({ eventId: id, stats })
}

export default apiHandler(handler)
