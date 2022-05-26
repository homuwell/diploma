const jwt = require('jwt-then')
import {intArg, list, nonNull, queryField} from "nexus";


export const getUserData = queryField('getUserData',{
    description: 'Get user data',
    type: 'User',
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,__,ctx) {
        const user = await ctx.prisma.user.findUnique({
            where: {
                id: ctx.user.id
            }
        });
        if (!user) {
            throw new Error('Такого пользователя не существует');
        }
        return user
    }
});

export const getUserLogin = queryField('getUserLogin', {
    description: 'Get user login',
    type: 'User',
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,__,ctx) {
        return await ctx.prisma.user.findUnique({
            where: {
                id: ctx.user.id
            }
        })
    }
})

export const getUserSchemes = queryField('getUserSchemes', {
    description: 'get all user schemes by user id',
    type: list('Schema'),
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,__, ctx) {
        return await ctx.prisma.schema.findMany({
            where: {
                UserId: ctx.user.id
            }
        })
    }
})

export const getSchema = queryField('getSchema', {
    description: 'get all schema data',
    type: 'Schema',
    args: {
        id: nonNull(intArg())
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args, ctx) {
        return await ctx.prisma.schema.findUnique({
            where: {
                id: args.id
            }
        })
    }
})


export const getSchemaResults = queryField('getSchemaResults', {
    description: 'get result of schema calculations',
    type: list('SchemaResults'),
    args: {
        id: nonNull(intArg())
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args, ctx) {
        return await ctx.prisma.schemaResults.findMany({
            where: {
                schemaId: args.id
            }
        })
    }
})