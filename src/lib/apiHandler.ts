// src/lib/apiHandler.ts
import { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from './prisma'

type Handler = (req: VercelRequest, res: VercelResponse) => Promise<any> | any

export function apiHandler(handler: Handler): Handler {
  return async (req, res) => {
    try {
      const result = await handler(req, res)
      return result
    } catch (error) {
      console.error('API Error:', error)
      return res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      })
    } finally {
      await prisma.$disconnect().catch(error => {
        console.error('Error disconnecting Prisma:', error)
      })
    }
  }
}