import {Request, Response} from "express";
import {PrismaClient} from '@prisma/client'
import {PubSub} from 'graphql-subscriptions'

export type User = {
    role: "VIEWER" | "USER" | "PREMIUMUSER" | "ADMIN",
    id: undefined | number
}
export type Context = {
    pubsub: PubSub,
    req: Request,
    res: Response,
    prisma: PrismaClient,
    user: User
}