import {ApolloServer, AuthenticationError} from "apollo-server-express";
import {PrismaClient} from "@prisma/client";
import {createServer} from 'http'
import {WebSocketServer} from "ws";
import {useServer} from 'graphql-ws/lib/use/ws';
import {graphqlUploadExpress} from 'graphql-upload'
const express = require('express');
import {Request, Response, NextFunction} from 'express'
import {PubSub} from "graphql-subscriptions";
import {schema} from './graphql/schema';
const next = require('next');
import {Context, User} from "./graphql/contextType";
import cookie from "cookie";
import path from "path";
import {ApolloServerPluginDrainHttpServer} from "apollo-server-core";
const port = parseInt(process.env.PORT!, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const jwt = require('jwt-then');
const handle = app.getRequestHandler();

const prisma = new PrismaClient();


const getUserRole = async (token: string) : Promise<User> => {
    let tokenErr = false;
    const payload = await jwt.verify(token, process.env.SECRET_ACCESS).catch((err:any) => {
        tokenErr = true;
    });
    if (!tokenErr) {
        const user = await prisma.user.findUnique({
            where: {
                id: payload.id
            }
        });
        if (!user) throw new AuthenticationError('Ошибка авторизации');
        return {
            role : user.role,
            id: user.id
        };
    } else {
        return {
            role: "VIEWER",
            id: undefined
        };
    }
}

async function bootstrap() {
    await app.prepare();
    const pubsub = new PubSub();
    const server = express();
    const httpServer = createServer(server);

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/api/graphql'
    });
    const serverCleanup = useServer({
        schema,
        context: (ctx,msg,args) => {
            return {
                pubsub,
                prisma
            }

        }
    }, wsServer);
    const apolloServer = new ApolloServer({

        schema,
        context: async({req, res}:any) :Promise<Context> => {
            let user: User = {role: "VIEWER", id: undefined};
            if (req.headers?.cookie) {
                const cookies = cookie.parse(req.headers.cookie);
                if (cookies?.accessToken) {
                    user = await getUserRole(cookies.accessToken);
                }
            }

            return {
                prisma,
                pubsub,
                req,
                res,
                user
            }
        },
        plugins: [
            ApolloServerPluginDrainHttpServer({httpServer}),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        }
                    }
                }
            }
        ]
    })
    await apolloServer.start();
    server.use(graphqlUploadExpress());
    server.use(express.static(path.join(__dirname, '/public')));
    apolloServer.applyMiddleware({
        app: server,
        path: '/api/graphql',
    });
    server.get('*', (req:Request, res: Response) => {
        return handle(req,res);
    });

    server.listen(port, () => {
        console.log(`Express server is now running on http:/localhost:${port}`);
    })
    const PORT = 4000;
    httpServer.listen(PORT, () => {
        console.log(
            `Http server for (web sockets) is now running on http://localhost:${PORT}${apolloServer.graphqlPath}`,
        );
    });
}
bootstrap();
/*
app.prepare().then(async () => {
    const server = express();
    const corsOptions = {
        origin: 'http://localhost:3000'
    }
    const cookie = require('cookie');
    const {PrismaClient}= require("@prisma/client");
    const {ApolloServer, AuthenticationError} = require( "apollo-server-express");
    const prisma = new PrismaClient();
    const apolloServer = new ApolloServer({

        schema,
        context: async({req, res}:any) :Promise<Context> => {
            let user: User = {role: "VIEWER", id: undefined};
            if (req.headers?.cookie) {
                const cookies = cookie.parse(req.headers.cookie);
                if (cookies?.accessToken) {
                    user = await getUserRole(cookies.accessToken);
                }
            }

            return {
                prisma,
                req,
                res,
                user
            }
        },
    })
    await apolloServer.start();
    server.all('*', (req: Request, res:Response, next: NextFunction ) => {
        if(req.url === apolloServer.graphqlPath) {
            return next();
        }
        return handle(req, res);
    });
    apolloServer.applyMiddleware({
        app: express,
        path: '/api/graphql',
        cors: corsOptions
    })

    await server.listen(port, () => {
        console.log('server started');
    })
})

import {ApolloServer, AuthenticationError} from 'apollo-server-micro';
import {processRequest} from "graphql-upload";
import { PrismaClient } from '@prisma/client'
import Cors from "micro-cors";
const jwt = require('jwt-then');
import { WebSocketServer } from 'ws';
import {schema} from "../../graphql/schema";
import cookie from "cookie";
import {Context, User} from "../../graphql/contextType";
import { useServer } from 'graphql-ws/lib/use/ws';
import {Disposable} from "graphql-ws";
import type {NextApiResponse} from 'next'
import { Socket } from "net";
import { Server as NetServer } from "http";

type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            ws: WebSocketServer
        };
    };
};

const prisma = new PrismaClient();
const getUserRole = async (token: string) : Promise<User> => {
    let tokenErr = false;
    const payload = await jwt.verify(token, process.env.SECRET_ACCESS).catch((err:any) => {
        tokenErr = true;
    });
    if (!tokenErr) {
        const user = await prisma.user.findUnique({
            where: {
                id: payload.id
            }
        });
        if (!user) throw new AuthenticationError('Ошибка авторизации');
        return {
            role : user.role,
            id: user.id
        };
    } else {
        return {
            role: "VIEWER",
            id: undefined
        };
    }
}


const cors = Cors({
    //allowCredentials: true,
    //origin: 'http://localhost:3000'
});

let serverCleanup: Disposable | null = null;

const server = new ApolloServer({
    schema,
    context: async({req, res}) :Promise<Context> => {
        let user: User = {role: "VIEWER", id: undefined};
        if (req.headers?.cookie) {
            const cookies = cookie.parse(req.headers.cookie);
            if (cookies?.accessToken) {
                user = await getUserRole(cookies.accessToken);
            }
        }

        return {
            prisma,
            req,
            res,
            user
        }
    },
    plugins: [
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup?.dispose();
                    }
                }
            }
        }
    ]


});

const startServer = server.start();


const wsServer = new WebSocketServer({
    noServer: true
})


const getHandler = async () => {
    await startServer;
    return server.createHandler({
        path: '/api/graphql',
    });
}

export const config = {
    api: {
        bodyParser: false,
    }
}

//@ts-ignore
export default cors(async (req, res: NextApiResponseServerIO) => {
    const contentType = req.headers["content-type"];
    if (contentType && contentType.startsWith("multipart/form-data")) {
        //@ts-ignore
        req.filePayload = await processRequest(req, res);
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://studio.apollographql.com"
    );
    if (req.method === "OPTIONS") {
        res.end();
        return false;
    }

    res.socket.server.ws ||= (() => {
        res.socket.server.on('upgrade', function (request, socket, head) {
            wsServer.handleUpgrade(request, socket, head, function (ws) {
                wsServer.emit('connection', ws);
            })
        })
        serverCleanup = useServer({ schema }, wsServer);
        return wsServer;
    })();



    const h = await getHandler();

    await h(req, res)

    //await startServer;
    // await server.createHandler({ path: "/api/graphql" })(req, res);
});
*/