import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { prisma } from './src/lib/prisma.ts'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
	res.json({ ok: true })
})

// Get stats for an event (returns array of calendarStat objects)
app.get('/events/:id/stats', async (req, res) => {
	const { id } = req.params
	try {
		const stats = await prisma.calendarStat.findMany({ where: { eventId: id } })
		res.json({ eventId: id, stats })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Failed to fetch stats' })
	}
})

// Increment a specific platform counter for an event
app.post('/events/:id/click', async (req, res) => {
	const { id } = req.params
	const { platform } = req.body
	if (!platform || (platform !== 'google' && platform !== 'apple')) {
		return res.status(400).json({ error: 'platform is required and must be "google" or "apple"' })
	}

	try {
		// Ensure event exists (create minimal event if missing)
		await prisma.event.upsert({
			where: { id },
			update: {},
			create: { id, name: id },
		})

		// Upsert calendarStat by the composite unique (eventId, platform)
		const stat = await prisma.calendarStat.upsert({
			where: { eventId_platform: { eventId: id, platform } },
			update: { count: { increment: 1 } },
			create: { eventId: id, platform, count: 1 },
		})

		res.json(stat)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Failed to increment counter' })
	}
})

const port = process.env.PORT ? Number(process.env.PORT) : 5000
const server = app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`)
})

// Clean shutdown
const shutdown = async () => {
	console.log('Shutting down server...')
	server.close()
	await prisma.$disconnect()
	process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

