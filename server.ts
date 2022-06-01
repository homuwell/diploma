import {ApolloServer, AuthenticationError} from "apollo-server-express";
import {PrismaClient} from "@prisma/client";
const https = require('node:https');
import {WebSocketServer} from "ws";
import {useServer} from 'graphql-ws/lib/use/ws';
import cors from 'cors'
import nextjsRequestHandler from 'next'
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
const fs = require('fs');

const cert = fs.readFileSync(path.resolve(process.cwd(),"./cerificates/localhost.pem"), "utf-8");
const key = fs.readFileSync(path.resolve(process.cwd(),"./cerificates/localhost-key.pem"), "utf-8");
console.log(key);
const httpsOptions = {
    cert: cert,
    key: key
}
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
    const httpServer = await https.createServer({
        cert: fs.readFileSync(path.resolve(process.cwd(),"./cerificates/localhost.pem"), "utf-8"),
        key: fs.readFileSync(path.resolve(process.cwd(),"./cerificates/localhost-key.pem"), "utf-8")
        },
        server);

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/api/graphql'
    });
    const serverCleanup = useServer({
        schema,
        onConnect: () => {
            console.log('Connected!');
        },
        onError: (ctx, message, errors) => {
            console.log(errors);
        },
        onDisconnect: () => {
            console.log('Disconnected');
        },
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
        ],

    })
    await apolloServer.start();
    server.use(cors());
    server.use(graphqlUploadExpress());
    server.use(express.static(path.join(__dirname, '/public')));
    apolloServer.applyMiddleware({
        app: server,
        path: '/api/graphql',
    });

    server.get('*', (req:Request, res: Response) => {
       req.secure ? handle(req,res) : res.redirect('https://' + req.headers.host + req.url)
    });

/*
    server.listen(4000, () => {
        console.log(`Express server is now running on http:/localhost:${port}`);
    })

 */


    const PORT = 4000;
    httpServer.listen(PORT, () => {
        console.log(
            `Http server for (web sockets) is now running on http://localhost:${PORT}${apolloServer.graphqlPath}`,
        );
    });
}
bootstrap();
