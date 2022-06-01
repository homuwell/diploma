import {v4} from "uuid";
const sha256 = require('js-sha256');
const jwt = require('jwt-then')
import {floatArg, intArg, list, mutationField, nonNull, objectType, stringArg, subscriptionField} from "nexus";
import sendEmail from "../../lib/sendEmail";
import {removeCookies, setCookies} from "cookies-next";
import sendResetPassLink from "../../lib/passResetEmail";
import {form_d, form_s, gauss_c, sf1, sf2} from "../../schemaCalculations/functionsLibrary";
import {AuthenticationError} from "apollo-server-express";
import {InputOperationAmplifiersType} from "./operationAmplifiers";
const MAX_NODES = 100;
const MAX_BIPOLAR = 50;
const MAX_MULTIPOLE = 20;
const fs = require('fs');
const Calculations = require('../../lib/circuitCalculation/calculations');


export const createUser = mutationField('createUser',{
    description: 'create User',
    type: 'User',
    args: {
        login: nonNull(stringArg({description: 'user login'})),
        name: nonNull(stringArg({description: 'user name'})),
        surname: nonNull(stringArg({description: 'user surname'})),
        phoneNumber: nonNull(stringArg({description: 'user number as string'})),
        email: nonNull(stringArg({description: 'user email as string'})),
        password: nonNull(stringArg({description: 'user password as string'})),
    },
    async resolve(_,args,ctx) {
        const findByLogin = await  ctx.prisma.user.findUnique({
            where: {
                login: args.login
            }
        })
        const findByEmail = await ctx.prisma.user.findUnique({
            where: {
                email: args.email
            }
        })
        const findByPhoneNumber = await ctx.prisma.user.findUnique({
            where: {
                phoneNumber: args.phoneNumber
            }
        })
        if (findByLogin) {

            throw new Error('Пользователь с таким логином уже существует ')
        }
        if (findByEmail) {
            throw new Error('Пользователь с такой электронной почтой уже существует')
        }
        if (findByPhoneNumber) {
            throw new Error('Пользователь с таким номером телефона уже существует ')
        }
        const user = await ctx.prisma.user.create({
            data: {
                login: args.login,
                role: 'USER',
                name: args.name,
                surname: args.surname,
                phoneNumber: args.phoneNumber,
                email: args.email,
                password: sha256((args.password + process.env.SALT)),
                refreshToken: v4(),
                picture: '/userImages/default.png'
            }
        });
        const activationLinkObj = {
            login: user.login,
            date: Date.now()
        }
        const activationLink = await  jwt.sign(activationLinkObj, process.env.SECRET_ACTIVATE,{expiresIn: '1d'});
        await sendEmail(args.email, activationLink);
        return null
    }
})

export const loginUser = mutationField('loginUser', {
    description: 'Mutation to authenticate user and send back tokens',
    type: 'User',
    args: {
        login: nonNull(stringArg({description: 'User login'})),
        password: nonNull(stringArg({description: 'user password as string'}))
    },
    async resolve(_,args,ctx) {
        const existingUser = await ctx.prisma.user.findUnique({
            where: {
                login: args.login
            }
        });
        if (!existingUser) {
            throw new Error('Пользователя с таким логином не существует');
        }

        const checkPassword = await sha256(args.password + process.env.SALT);

        if (existingUser.password !== checkPassword) {
            throw new Error('Неверный пароль')
        }
        if (!existingUser.isActivated) {
            throw new Error('Аккаунт этого пользователя не активирован')
        }
        const accessToken = await jwt.sign({
            id: existingUser.id,
            time: Date.now()
        }, process.env.SECRET_ACCESS,{expiresIn: '30m'});
        const refreshToken =  await jwt.sign({
            uuid: v4(),
            time: Date.now()
        }, process.env.SECRET_REFRESH,{expiresIn: '30d'});
        setCookies('refreshToken', refreshToken,{req: ctx.req, res: ctx.res, path: '/', httpOnly: true, sameSite: 'strict', secure: true,maxAge: 30*24*60*60 });
        setCookies('accessToken', accessToken,{req: ctx.req, res: ctx.res, path: '/', httpOnly: true,sameSite: 'strict', secure: true, maxAge: 60*30});
        await ctx.prisma.user.update({
            where: {
                login: args.login
            },
            data: {
                refreshToken: refreshToken
            }
        });
        return null
    }
});

export const activateAccount = mutationField('activateAccount', {
    type: 'User',
    args: {
        token: nonNull(stringArg({description: 'jwt with user  login'}))
    },
    async resolve(_,args,ctx) {
        const activationToken = await jwt.verify(args.token, process.env.SECRET_ACTIVATE);
        if (activationToken === null) {
            throw new Error('Невалидная ссылка');
        }
        if (Date.now() >= activationToken.exp * 1000) {
            throw new Error('Время действия ссылки истекло');
        }
        const user = await ctx.prisma.user.findUnique({
            where: {
                login: activationToken.login
            }
        });
        if (!user) {
            throw new Error('Такого пользователя не существует');
        } else if (user.isActivated) {
            throw new Error('Этот аккаунт уже активирован')
        } else {

            await ctx.prisma.user.update({
                where: {
                    login: activationToken.login
                },
                data: {
                    isActivated: true
                }
            })
        }
        return null
    }
})

export const resetPasswordLink = mutationField('resetPasswordLink', {
    description: 'Send to user email link to reset password',
    type: 'User',
    args: {
        email: nonNull(stringArg({description: 'user email as string'}))
    },
    async resolve(_,args,ctx) {
        const user = await ctx.prisma.user.findUnique({
            where: {
                email: args.email
            }
        })
        if (!user) {
            throw new Error('Пользователя с такой почтой не существует');
        }
        const resetLink = await jwt.sign({
            id: user.id,
            uuid: v4()
        }, process.env.SECRET_RESET, {expiresIn: '15m'});
        await sendResetPassLink(args.email, resetLink);
        return user
    }
})

export const resetPasswordAuth = mutationField('resetPasswordAuth',{
    description: 'Validate link and give user access to reset page',
    type: 'User',
    args: {
        token: nonNull(stringArg({description: 'jwt with user id'}))
    },
    async resolve(_, args, ctx) {
        const token = await jwt.verify(args.token, process.env.SECRET_RESET);
        const user = await ctx.prisma.user.findUnique({
            where: {
                id: token.id
            }
        })
        if (!user) {
            throw new Error('Пользователя с такой почтой не существует');
        } else {
            return user;
        }
    }
})

export const resetPassword = mutationField('resetPassword', {
    description: 'reset user password in database',
    type: 'User',
    args: {
        id: nonNull(intArg({description: 'user id'})),
        password: nonNull(stringArg({description: 'new user password as string'}))
    },
    async resolve(_,args,ctx) {
        const newPassword = await sha256(args.password + process.env.SALT)
        const user = await ctx.prisma.user.findUnique({
            where: {
                id: args.id
            }
        })
        if (!user) {
            throw new Error('Пользователя с такой почтой не существует');
        } else if (user.password === newPassword) {
            throw new Error('Нельзя изменить пароль на старый');
        } else {
            await ctx.prisma.user.update({
                where: {
                    id: args.id
                },
                data: {
                    password: await sha256(args.password + process.env.SALT)
                }
            })
            return null;
        }
    }
})

export const logoutUser = mutationField('logoutUser', {
    description: 'logout user and remove cookies',
    type: 'User',
    authorize: (_,__,ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,__,ctx) {
        await ctx.prisma.user.update({
            where: {
                id: ctx.user.id
            },
            data: {
                refreshToken: ''
            }
        });
        removeCookies('accessToken',{req: ctx.req, res: ctx.res, path: '/', httpOnly: true, maxAge: 30*60 });
        removeCookies('refreshToken', {req: ctx.req, res: ctx.res, path: '/', httpOnly: true, maxAge: 30*24*60*60 });
        return null;
    }
})

export const authUser = mutationField('authUser', {
    description: 'check user authenticated or not',
    type: 'User',
    async resolve(_,__,ctx) {
        if (ctx.user.role === 'VIEWER') {
           throw new AuthenticationError('нет токена');
        } else {
            return await ctx.prisma.user.findUnique({
                where: {
                    id: ctx.user.id
                }
            })
        }
    }
})


export const uploadUserPicture = mutationField('uploadUserPicture', {
    description: 'upload to server user picture and store its path in database',
    type: 'User',
    args: {
        picture: nonNull('Upload')
    },
    authorize: (_,__,ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args, ctx) {
        const {filename, mimetype, createReadStream} = await args.picture;
        const stream = createReadStream();
        const path = `${process.cwd()}/public/userImages/${ctx.user.id}.jpg`;
        await new Promise((resolve, reject) =>
            stream
                .on('error', (error: string) => {
                    if (stream.truncated)
                        fs.unlinkSync(path);
                    reject(error);
                })
                .pipe(fs.createWriteStream(path))
                .on('error', (error: string) => reject(error))
                .on('finish', () => resolve({path}))
        )
        await ctx.prisma.user.update({
            where: {
                id: ctx.user.id
            },
            data: {
                picture: `/userImages/${ctx.user.id}.jpg`
            }
        });
        return null
    }
})


export const refreshAccessToken = mutationField('refreshAccessToken',{
    description: 'refresh token',
    type: nonNull('User'),
    args: {
        token: stringArg({description: 'refresh token'})
    },
    async resolve(_, args, ctx) {
        let refreshToken: string;
        if (args.token === null || args.token === undefined) {
            if (ctx.req.cookies?.refreshToken) {
                refreshToken = ctx.req.cookies.refreshToken;
            } else {
                throw new Error('Токена нет в куках');
            }
        } else {
            refreshToken = args.token;
        }

        const refreshPayload = await jwt.verify(refreshToken, process.env.SECRET_REFRESH);
        if (Date.now() >= refreshPayload?.exp * 1000) {
            throw new Error('токен истёк');
        }

        const user = await ctx.prisma.user.findUnique({
            where: {
                refreshToken: refreshToken
            }
        });
        if (user?.refreshToken != refreshToken || !user) {
            throw new Error('Невалидный токен пользователя');
        }
        const newAccessToken = await jwt.sign({
            id: user.id,
            time: Date.now()
        }, process.env.SECRET_ACCESS, {expiresIn: '30m'});
        if (args.token === null) {
            setCookies('accessToken', newAccessToken, {req: ctx.req, res: ctx.res, path: '/', httpOnly: true, maxAge: 30* 60} );
        }
        return {
            ...user,
            accessToken: newAccessToken
        }
    }
})

export const createCalculationDirectives = mutationField('createCalculationDirectives', {
    description: 'create Calculation Directives',
    type: 'CalculationDirectives',
    args: {
        schemaId: nonNull(intArg()),
        inM: nonNull(intArg()),
        inP: nonNull(intArg()),
        outM: nonNull(intArg()),
        outP: nonNull(intArg()),
        functionType: nonNull('FunctionType' ),
        firstFuncElem: nonNull(floatArg()),
        secondFuncElem: nonNull(floatArg()),
        thirdFuncElem:nonNull(floatArg())

    },
    authorize: (_,__,ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {

        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы');
        }
        const existingCalculationDirectives = await ctx.prisma.calculationDirectives.findUnique({
            where: {
                id: args.schemaId
            }
        });
        if (existingCalculationDirectives) {
            throw new Error(`для этой схемы уже заданы расчётные директивы`);
        }
        return await ctx.prisma.calculationDirectives.create({
            data: {
                schemaId: args.schemaId,
                inNodeM: args.inM,
                inNodeP: args.inP,
                outNodeP: args.outP,
                outNodeM: args.outM,
                functionType: args.functionType,
                first: args.firstFuncElem,
                second: args.secondFuncElem,
                third: args.secondFuncElem
            }
        })
    }
})

export const createSchema = mutationField('createSchema', {
    description: 'add schema parameters to database',
    type: 'Schema',
    args: {
        nodes: nonNull(intArg()),
        name: nonNull(stringArg()),
        resistors: nonNull(intArg()),
        capacitors: nonNull(intArg()),
        inductors: nonNull(intArg()),
        VCCSs: nonNull(intArg()),
        VCVSs: nonNull(intArg()),
        CCCSs: nonNull(intArg()),
        CCVSs: nonNull(intArg()),
        transformers: nonNull(intArg()),
        idealTransformers: nonNull(intArg()),
        operationAmplifiers: nonNull(intArg()),
        idealOperationAmplifiers: nonNull(intArg()),
        bipolarTransistors: nonNull(intArg()),
        unipolarTransistors: nonNull(intArg())
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_, args, ctx) {
        if (args.nodes < 0 || args.nodes > MAX_NODES) {
            throw new Error('Неправильное задание числа узлов');
        }
        if (args.resistors < 0 || args.resistors > MAX_BIPOLAR) {
            throw new Error('Неправильное задание числа резисторов');
        }
        if (args.capacitors < 0 || args.capacitors > MAX_BIPOLAR) {
            throw new Error('Неправильное задание числа конденсаторов');
        }
        if (args.inductors < 0 || args.capacitors > MAX_BIPOLAR) {
            throw new Error('Неправильное задание числа катушек');
        }
        if (args.VCCSs < 0 || args.VCCSs > MAX_MULTIPOLE) {
            throw new Error('Неправильное задание числа источников тока управляемых напряжением');
        }
        if (args.VCVSs < 0 || args.VCVSs > MAX_MULTIPOLE) {
            throw new Error('Неправильное задание числа источников напряжением управляемых напряжением');
        }
        if (args.CCCSs < 0 || args.CCCSs > MAX_MULTIPOLE) {
            throw new Error('Неправильное задание числа источников тока управляемых током');
        }
        if (args.CCVSs < 0 || args.CCVSs > MAX_MULTIPOLE) {
            throw new Error('Неправильное задание числа источников напряжения управляемых током');
        }
        if (args.transformers < 0 || args.transformers > MAX_MULTIPOLE) {
            throw new Error('Неправильное задание числа трансформаторов');
        }
        if (args.idealTransformers < 0 || args.idealTransformers > MAX_MULTIPOLE) {
            throw new Error('Неправильное задание числа идеальных трансформаторов');
        }
        if (args.operationAmplifiers < 0 || args.operationAmplifiers > MAX_MULTIPOLE) {
            throw new Error('Неправильное задание числа операционных усилителей');
        }
        if (args.idealOperationAmplifiers < 0 || args.idealOperationAmplifiers > MAX_MULTIPOLE) {
            throw new Error('Неправильное задание числа идеальных операционных усилителей');
        }
        if (args.bipolarTransistors < 0 || args.bipolarTransistors > MAX_MULTIPOLE) {
            throw new Error('Неправильное задание числа биполярных транзисторов');
        }
        if (args.unipolarTransistors < 0 || args.unipolarTransistors > MAX_MULTIPOLE) {
            throw new Error('Неправильное задание числа униполярных транзисторов');
        }


        const findByName = await ctx.prisma.schema.findMany({
            where: {
                UserId: ctx.user.id,
                name: args.name
            }
        })

        if (findByName.length !== 0) {
            throw new Error('Схема с таким именем уже существует');
        }
        const schema = await ctx.prisma.schema.create({
            data: {
                UserId: ctx.user.id!,
                name: args.name,
                nv: args.nodes,
                nr: args.resistors,
                nc: args.capacitors,
                nl: args.inductors,
                nju: args.VCCSs,
                nei: args.CCVSs,
                nji: args.CCCSs,
                nev: args.VCVSs,
                ntr: args.transformers,
                ntri: args.idealTransformers,
                nou: args.operationAmplifiers,
                noui: args.idealOperationAmplifiers,
                ntb: args.bipolarTransistors,
                ntu: args.unipolarTransistors
            }
        })
        return schema
    }
})






export const calculateSchema = mutationField('calculateSchema', {
    type: 'String',
    args: {
        id: nonNull(intArg())
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const calculationDirectives = await ctx.prisma.calculationDirectives.findUnique({
            where: {
                schemaId: args.id
            }
        });
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.id
            }
        })

        const resistors = await ctx.prisma.resistor.findMany({
            where: {
                schemaId: args.id
            }
        });
        const inductors = await ctx.prisma.inductor.findMany({
            where: {
                schemaId: args.id
            }
        });
        const capacitors = await ctx.prisma.capacitor.findMany({
            where: {
                schemaId: args.id
            }
        })
        const VCCSs = await ctx.prisma.vCCS.findMany({
            where: {
                schemaId: args.id
            }
        })
        const VCVSs = await ctx.prisma.vCVS.findMany({
            where: {
                schemaId: args.id
            }
        })
        const CCCSs = await ctx.prisma.cCCS.findMany({
            where: {
                schemaId: args.id
            }
        })
        const CCVSs = await ctx.prisma.cCVS.findMany({
            where: {
                schemaId: args.id
            }
        });

        const transformers = await ctx.prisma.transformer.findMany({
            where: {
                schemaId: args.id
            }
        });
        const idealTransformers = await ctx.prisma.idealTransformer.findMany({
            where: {
                schemaId: args.id
            }
        });

        const operationAmplifiers = await ctx.prisma.operationAmplifier.findMany({
            where: {
                schemaId: args.id
            }
        });
        const idealOperationAmplifiers = await ctx.prisma.idealOperationAmplifier.findMany({
            where: {
                schemaId: args.id
            }
        });
        const bipolarTransistors = await ctx.prisma.bipolarTransistor.findMany({
            where: {
                schemaId: args.id
            }
        });
        const unipolarTransistors = await ctx.prisma.unipolarTransistor.findMany({
            where: {
                schemaId: args.id
            }
        })
        let functionArgs = {
            first: calculationDirectives!.first,
            second: calculationDirectives!.second,
            third: calculationDirectives!.third
        }
        const calculations = new Calculations({
            functionType: calculationDirectives!.functionType,
            functionArgs,
            nodes: schema!.nv,
            capacitors,
            resistors,
            inductors,
            idealOperationAmplifiers,
            operationAmplifiers,
            transformers,
            idealTransformers,
            bipolarTransistors,
            unipolarTransistors,
            VCCSsAll: VCCSs,
            VCVSsAll: VCVSs,
            CCCSsAll: CCCSs,
            CCVSsAll: CCVSs
        })
        await ctx.prisma.schemaResults.deleteMany({
            where: {
                schemaId: args.id
            }
        });
        let results = calculations.calculateElemsComplex();
        results = results.map((elem:any)=> {
            elem.schemaId = args.id;
        });
        await ctx.prisma.schemaResults.createMany({
                data: results
            }
        )
        return 'Произведён расчёт схемы';
    }

})

export const createIdealOperationAmplifiers = mutationField('createIdealOperationAmplifiers', {
    description: 'add Operation Amplifiers of schema to database',
    type: 'idealOperationAmplifier',
    args: {
        schemaId: nonNull(intArg()),
        idealOperationAmplifiers: nonNull(list(nonNull('InputIdealOperationAmplifiersType')))
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
            const schema = await ctx.prisma.schema.findUnique({
                where: {
                    id: args.schemaId
                }
            })
            if (!schema) {
                throw new Error('Нет такой схемы');
            }
            if (args.idealOperationAmplifiers.length != schema.noui) {
                throw new Error('Несоответствующее число идеальных операционных усилителей');
            }
            for (let i = 0; i < args.idealOperationAmplifiers.length; i++) {

                await ctx.prisma.idealOperationAmplifier.create({
                    data: {
                        schemaId: args.schemaId,
                        mFirstNode: args.idealOperationAmplifiers[i].mFirstNode,
                        pFirstNode: args.idealOperationAmplifiers[i].pFirstNode,
                        mSecondNode: args.idealOperationAmplifiers[i].mSecondNode,
                        pSecondNode: args.idealOperationAmplifiers[i].pSecondNode
                    }
                })
            }
            return null
        }
})

export const createOperationAmplifiers = mutationField('createOperationAmplifiers', {
    description: 'add Operation Amplifiers of schema to database',
    type: 'operationAmplifier',
    args: {
        schemaId: nonNull(intArg()),
        operationAmplifiers: nonNull(list(nonNull('InputOperationAmplifiersType')))
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы');
        }
        if (args.operationAmplifiers.length != schema.nou) {
            throw new Error('Несоответствующее число Операционных усилителей');
        }
        for (let i = 0; i < args.operationAmplifiers.length; i++) {
            await ctx.prisma.operationAmplifier.create({
                data: {
                    schemaId: args.schemaId,
                    mFirstNode: args.operationAmplifiers[i].mFirstNode,
                    pFirstNode: args.operationAmplifiers[i].pFirstNode,
                    mSecondNode: args.operationAmplifiers[i].mSecondNode,
                    pSecondNode: args.operationAmplifiers[i].pSecondNode,
                    rIn: args.operationAmplifiers[i].rIn,
                    rOut: args.operationAmplifiers[i].rOut,
                    u: args.operationAmplifiers[i].u,
                    fT: args.operationAmplifiers[i].fT
                }
            })
        }
        return null
    }
})



export const createCapacitors = mutationField('createCapacitors', {
    description: 'add capacitors of schema to database',
    type: 'Capacitor',
    args: {
        schemaId: nonNull(intArg()),
        capacitors: nonNull(list(nonNull('InputCapacitorsType')))
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_, args, ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        });
        if (!schema) {
            throw new Error('Нет такой схемы');
        }
        if (args.capacitors!.length != schema.nc) {
            throw new Error('Несоответствующее число конденсаторов');
        }
        for (let i = 0; i < args.capacitors.length; i++) {
            await ctx.prisma.capacitor.create({
                data: {
                    schemaId: args.schemaId,
                    capacity: args.capacitors[i].capacity,
                    pNode: args.capacitors[i].pNode,
                    mNode: args.capacitors[i].mNode
                }
            })
        }
        return null
    }
})

export const createTransformers = mutationField('createTransformers', {
    description: 'add transformers to schema and database',
    type: 'transformer',
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    args: {
        schemaId: nonNull(intArg()),
        transformers: nonNull(list(nonNull('InputTransformers')))
    },
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы');
        }
        if (args.transformers.length !== schema.ntr) {
            throw new Error('Несоответствующее число трансформаторов');
        }
        for(let i = 0; i < args.transformers.length;i++) {
            await ctx.prisma.transformer.create({
                data: {
                    schemaId: args.schemaId,
                    mFirstNode: args.transformers[i].mFirstNode,
                    pFirstNode: args.transformers[i].pFirstNode,
                    mSecondNode: args.transformers[i].mSecondNode,
                    pSecondNode: args.transformers[i].pSecondNode,
                    M: args.transformers[i].M,
                    R1: args.transformers[i].R1,
                    R2: args.transformers[i].R2,
                    L1: args.transformers[i].L1,
                    L2: args.transformers[i].L2
                }
            })
        }
        return null
    }
})


export const createIdealTransformers = mutationField('createIdealTransformers', {
    description: 'add ideal transformers to schema and database',
    type: 'idealTransformer',
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    args: {
        schemaId: nonNull(intArg()),
        idealTransformers: nonNull(list(nonNull('InputIdealTransformersType')))
    },
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы');
        }
        if (args.idealTransformers.length !== schema.ntri) {
            throw new Error('Несоответствующее число Идеальный трансформаторов');
        }
        for(let i = 0; i < args.idealTransformers.length;i++) {
            await ctx.prisma.idealTransformer.create({
                data: {
                    schemaId: args.schemaId,
                    mFirstNode: args.idealTransformers[i].mFirstNode,
                    pFirstNode: args.idealTransformers[i].pFirstNode,
                    mSecondNode: args.idealTransformers[i].mSecondNode,
                    pSecondNode: args.idealTransformers[i].pSecondNode,
                    gain: args.idealTransformers[i].gain,
                }
            })
        }
        return null
    }
})

export const createBipolarTransistors = mutationField('createBipolarTransistors', {
    description: 'add bipolar transistors to schema and database',
    type: 'bipolarTransistor',
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    args: {
        schemaId: nonNull(intArg()),
        bipolarTransistors: nonNull(list(nonNull('InputBipolarTransistors')))
    },
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы');
        }
        if (args.bipolarTransistors.length !== schema.ntb) {
            throw new Error('Несоответствующее число Идеальный трансформаторов');
        }
        for(let i = 0; i < args.bipolarTransistors.length;i++) {
            await ctx.prisma.bipolarTransistor.create({
                data: {
                    schemaId: args.schemaId,
                    ne: args.bipolarTransistors[i].ne,
                    nc: args.bipolarTransistors[i].nc,
                    nb: args.bipolarTransistors[i].nb,
                    Rb: args.bipolarTransistors[i].Rb,
                    Re: args.bipolarTransistors[i].Re,
                    Rc: args.bipolarTransistors[i].Rc,
                    Ce: args.bipolarTransistors[i].Ce,
                    Cc: args.bipolarTransistors[i].Cc,
                    b: args.bipolarTransistors[i].b,

                }
            })
        }
        return null
    }
})

export const createUnipolarTransistors = mutationField('createUnipolarTransistors', {
    description: 'add bipolar transistors to schema and database',
    type: 'unipolarTransistor',
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    args: {
        schemaId: nonNull(intArg()),
        unipolarTransistors: nonNull(list(nonNull('InputUnipolarTransistors')))
    },
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы');
        }
        if (args.unipolarTransistors.length !== schema.ntu) {
            throw new Error('Несоответствующее число Идеальный трансформаторов');
        }
        for(let i = 0; i < args.unipolarTransistors.length;i++) {
            await ctx.prisma.unipolarTransistor.create({
                data: {
                    schemaId: args.schemaId,
                    nz: args.unipolarTransistors[i].nz,
                    ns: args.unipolarTransistors[i].ns,
                    ni: args.unipolarTransistors[i].ni,
                    Rc: args.unipolarTransistors[i].Rc,
                    Czi: args.unipolarTransistors[i].Czi,
                    Czs: args.unipolarTransistors[i].Czs,
                    Csi: args.unipolarTransistors[i].Csi,
                    S: args.unipolarTransistors[i].S,
                }
            })
        }
        return null
    }
})

export const createInductors = mutationField('createInductors', {
    description: 'add inductors to schema and database',
    type: 'Inductor',
    args: {
        schemaId: nonNull(intArg()),
        inductors: nonNull(list(nonNull('InputInductorsType')))
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_, args, ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы');
        }
        if (args.inductors.length != schema.nl) {
            throw new Error('Несоответствующее число индукторов');
        }
        for (let i = 0; i < args.inductors.length; i++) {
            await ctx.prisma.inductor.create({
                data: {
                    schemaId: args.schemaId,
                    induction: args.inductors[i].induction,
                    pNode: args.inductors[i].pNode,
                    mNode: args.inductors[i].mNode
                }
            })
        }
        return null
    }
})

export const createResistors = mutationField('createResistors',{
    description: 'add resistors to schema and database',
    type: 'Resistor',
    args: {
        schemaId: nonNull(intArg()),
        resistors: nonNull(list(nonNull('InputResistorsType')))
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы');
        }
        if (args.resistors.length != schema.nr) {
            throw new Error('Несоответствующее число резисторов');
        }
        for(let i = 0; i < args.resistors.length;i++) {
            await ctx.prisma.resistor.create({
                data: {
                    schemaId: args.schemaId,
                    resistance: args.resistors[i].resistance,
                    pNode: args.resistors[i].pNode,
                    mNode: args.resistors[i].mNode
                }
            })
        }
        return null
    }
})




export const createVCCSs = mutationField('createVCCSs', {
    description: 'add VCCSs to database and schema',
    type: 'VCCS',
    args: {
        schemaId: nonNull(intArg()),
        VCCSs: nonNull(list(nonNull('InputControlledSource')))
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы');
        }
        if(args.VCCSs.length != schema.nju) {
            throw new Error('Несоответствующее число ИТУН');
        }
        for(let i = 0; i < args.VCCSs.length;i++) {
            if(args.VCCSs[i].T1 === null && args.VCCSs[i].T2 === null) {
                await ctx.prisma.vCCS.create({
                    data: {
                        schemaId: args.schemaId,
                        mFirstNode: args.VCCSs[i].mFirstNode,
                        pFirstNode: args.VCCSs[i].pFirstNode,
                        mSecondNode: args.VCCSs[i].mSecondNode,
                        pSecondNode: args.VCCSs[i].pSecondNode,
                        T1: 0,
                        T2: 0,
                        transmission: args.VCCSs[i].transmission,
                    }
                })
            } else {
                await ctx.prisma.vCCS.create({
                    data: {
                        schemaId: args.schemaId,
                        mFirstNode: args.VCCSs[i].mFirstNode,
                        pFirstNode: args.VCCSs[i].pFirstNode,
                        mSecondNode: args.VCCSs[i].mSecondNode,
                        pSecondNode: args.VCCSs[i].pSecondNode,
                        T1: args.VCCSs[i].T1!,
                        T2: args.VCCSs[i].T2!,
                        transmission: args.VCCSs[i].transmission,
                    }
                })
            }
        }
        return null
    }
})

export const createVCVSs = mutationField('createVCVSs', {
    description: 'add VCVSs to schema and database',
    type: "VCVS",
    args: {
        schemaId: nonNull(intArg()),
        VCVSs: nonNull(list(nonNull('InputControlledSource')))
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы');
        }
        console.log(schema.nju);
        console.log(args.VCVSs);
        if(args.VCVSs.length != schema.nju) {
            throw new Error('Несоответствующее число ИНУН');
        }
        for(let i = 0; i < args.VCVSs.length;i++) {
            if(args.VCVSs[i].T1 === null && args.VCVSs[i].T2 === null) {
                await ctx.prisma.vCCS.create({
                    data: {
                        schemaId: args.schemaId,
                        mFirstNode: args.VCVSs[i].mFirstNode,
                        pFirstNode: args.VCVSs[i].pFirstNode,
                        mSecondNode: args.VCVSs[i].mSecondNode,
                        pSecondNode: args.VCVSs[i].pSecondNode,
                        T1: 0,
                        T2: 0,
                        transmission: args.VCVSs[i].transmission,
                    }
                })
            } else {
                await ctx.prisma.vCCS.create({
                    data: {
                        schemaId: args.schemaId,
                        mFirstNode: args.VCVSs[i].mFirstNode,
                        pFirstNode: args.VCVSs[i].pFirstNode,
                        mSecondNode: args.VCVSs[i].mSecondNode,
                        pSecondNode: args.VCVSs[i].pSecondNode,
                        T1: args.VCVSs[i].T1!,
                        T2: args.VCVSs[i].T2!,
                        transmission: args.VCVSs[i].transmission,
                    }
                })
            }
        }
        return null
    }
})

export const createCCCSs = mutationField('createCCCSs', {
    description: 'add CCCSs to schema and database',
    type: "CCCS",
    args: {
        schemaId: nonNull(intArg()),
        CCCSs: nonNull(list(nonNull('InputControlledSource')))
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы');
        }
        if(args.CCCSs.length != schema.nji) {
            throw new Error('Несоответствующее число ИТУТ');
        }
        for(let i = 0; i < args.CCCSs.length;i++) {
            if(args.CCCSs[i].T1 === null && args.CCCSs[i].T2 === null) {
                await ctx.prisma.cCCS.create({
                    data: {
                        schemaId: args.schemaId,
                        mFirstNode: args.CCCSs[i].mFirstNode,
                        pFirstNode: args.CCCSs[i].pFirstNode,
                        mSecondNode: args.CCCSs[i].mSecondNode,
                        pSecondNode: args.CCCSs[i].pSecondNode,
                        T1: 0,
                        T2: 0,
                        transmission: args.CCCSs[i].transmission,
                    }
                })
            } else {
                await ctx.prisma.cCCS.create({
                    data: {
                        schemaId: args.schemaId,
                        mFirstNode: args.CCCSs[i].mFirstNode,
                        pFirstNode: args.CCCSs[i].pFirstNode,
                        mSecondNode: args.CCCSs[i].mSecondNode,
                        pSecondNode: args.CCCSs[i].pSecondNode,
                        T1: args.CCCSs[i].T1!,
                        T2: args.CCCSs[i].T2!,
                        transmission: args.CCCSs[i].transmission,
                    }
                })
            }
        }
        return null
    }
})


export const createCCVSs = mutationField('createCCVSs', {
    description: 'add CCVSs to schema and database',
    type: "CCVS",
    args: {
        schemaId: nonNull(intArg()),
        CCVSs: nonNull(list(nonNull('InputControlledSource')))
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы');
        }
        console.log(args.CCVSs);
        console.log(schema.nei);
        if(args.CCVSs.length != schema.nei) {
            throw new Error('Несоответствующее число ИТУН');
        }
        for(let i = 0; i < args.CCVSs.length;i++) {
            if(args.CCVSs[i].T1 === null && args.CCVSs[i].T2 === null) {
                await ctx.prisma.cCVS.create({
                    data: {
                        schemaId: args.schemaId,
                        mFirstNode: args.CCVSs[i].mFirstNode,
                        pFirstNode: args.CCVSs[i].pFirstNode,
                        mSecondNode: args.CCVSs[i].mSecondNode,
                        pSecondNode: args.CCVSs[i].pSecondNode,
                        T1: 0,
                        T2: 0,
                        transmission: args.CCVSs[i].transmission,
                    }
                })
            } else {
                await ctx.prisma.cCVS.create({
                    data: {
                        schemaId: args.schemaId,
                        mFirstNode: args.CCVSs[i].mFirstNode,
                        pFirstNode: args.CCVSs[i].pFirstNode,
                        mSecondNode: args.CCVSs[i].mSecondNode,
                        pSecondNode: args.CCVSs[i].pSecondNode,
                        T1: args.CCVSs[i].T1!,
                        T2: args.CCVSs[i].T2!,
                        transmission: args.CCVSs[i].transmission,
                    }
                })
            }
        }
        return null
    }
})

export const changeResistor = mutationField('changeResistor', {
    description: 'Change resistors in Schema',
    type: "String",
    args: {
        elemId: nonNull(intArg()),
        data: nonNull('InputResistorsType')
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const resistor = await ctx.prisma.resistor.update({
            where: {
                id: args.elemId
            },
            data: {
                pNode: args.data.pNode,
                mNode: args.data.mNode,
                resistance: args.data.resistance

            }
        });
        if (!resistor) {
            throw new Error('Нет такого резистора');
        }
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
                schemaId: resistor.schemaId
        })
        return 'Значения резистора успешно изменены';

    }
})



export const addResistor = mutationField('addResistor', {
    description: 'add resistor i Schema',
    type: "Resistor",
    args: {
        schemaId: nonNull(intArg()),
        data: nonNull('InputResistorsType'),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы')
        }
        const resistor = await ctx.prisma.resistor.create({
            data: {
                schemaId: args.schemaId,
                pNode: args.data.pNode,
                mNode: args.data.mNode,
                resistance: args.data.resistance
            }
        });

        await ctx.prisma.schema.update({
            where: {
                id: args.schemaId
            },
            data: {
                nr: {increment: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
                schemaId: args.schemaId
        })

        return resistor;

    }
})

export const deleteResistor = mutationField('deleteResistor', {
    description: 'delete resistors in Schema',
    type: "String",
    args: {
        elemId: nonNull(intArg()),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const resistor = await ctx.prisma.resistor.delete({
            where: {
                id: args.elemId
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: resistor.schemaId
            },
            data: {
                nr: {decrement: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
                schemaId: resistor.schemaId
        })


        return 'Резистор успешно удалён';

    }
})


export const changeCapacitor = mutationField('changeCapacitor', {
    description: 'Change capacitor in Schema',
    type: "String",
    args: {
        elemId: nonNull(intArg()),
        data: nonNull('InputCapacitorsType')
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const capacitor = await ctx.prisma.capacitor.update({
            where: {
                id: args.elemId
            },
            data: {
                pNode: args.data.pNode,
                mNode: args.data.mNode,
                capacity: args.data.capacity

            }
        });
        if (!capacitor) {
            throw new Error('Нет такого конденсатора');
        }
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: capacitor.schemaId
        })
        return 'Значения резистора успешно изменены';

    }
})


export const addCapacitor = mutationField('addCapacitor', {
    description: 'add capacitor to Schema',
    type: "Capacitor",
    args: {
        schemaId: nonNull(intArg()),
        data: nonNull('InputCapacitorsType'),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы')
        }
        const capacitor = await ctx.prisma.capacitor.create({
            data: {
                schemaId: args.schemaId,
                pNode: args.data.pNode,
                mNode: args.data.mNode,
                capacity: args.data.capacity
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: args.schemaId
            },
            data: {
                nc: {increment: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: args.schemaId
        })
        return capacitor;

    }
})

export const deleteCapacitor = mutationField('deleteCapacitor', {
    description: 'delete capacitor in Schema',
    type: "String",
    args: {
        elemId: nonNull(intArg()),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const capacitor = await ctx.prisma.capacitor.delete({
            where: {
                id: args.elemId
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: capacitor.schemaId
            },
            data: {
                nc: {decrement: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: capacitor.schemaId
        })
        return 'Конденсатор успешно удалён';

    }
})

export const changeInductor = mutationField('changeInductor', {
    description: 'Change inductor in Schema',
    type: "String",
    args: {
        elemId: nonNull(intArg()),
        data: nonNull('InputInductorsType')
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const inductor = await ctx.prisma.inductor.update({
            where: {
                id: args.elemId
            },
            data: {
                pNode: args.data.pNode,
                mNode: args.data.mNode,
                induction: args.data.induction

            }
        });
        if (!inductor) {
            throw new Error('Нет такой катушки');
        }
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: inductor.schemaId
        })
        return 'Значения катушки успешно изменены';

    }
})


export const addInductor = mutationField('addInductor', {
    description: 'add inductor to Schema',
    type: "Inductor",
    args: {
        schemaId: nonNull(intArg()),
        data: nonNull('InputInductorsType'),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы')
        }
        const inductor = await ctx.prisma.inductor.create({
            data: {
                schemaId: args.schemaId,
                pNode: args.data.pNode,
                mNode: args.data.mNode,
                induction: args.data.induction
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: args.schemaId
            },
            data: {
                nl: {increment: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: args.schemaId
        })
        return inductor;

    }
})

export const deleteInductor = mutationField('deleteInductor', {
    description: 'delete inductor in Schema',
    type: "String",
    args: {
        elemId: nonNull(intArg()),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const inductor = await ctx.prisma.inductor.delete({
            where: {
                id: args.elemId
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: inductor.schemaId
            },
            data: {
                nr: {decrement: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: inductor.schemaId
        })

        return 'Катушка успешно удалёна';

    }
})


export const changeTransformer = mutationField('changeTransformer', {
    description: 'Change transformer in Schema',
    type: "String",
    args: {
        elemId: nonNull(intArg()),
        data: nonNull('InputTransformers')
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const transformer = await ctx.prisma.transformer.update({
            where: {
                id: args.elemId
            },
            data: {
                pFirstNode: args.data.pFirstNode,
                mFirstNode: args.data.mFirstNode,
                pSecondNode: args.data.pSecondNode,
                mSecondNode: args.data.mSecondNode,
                L1: args.data.L1,
                L2: args.data.L2,
                R1: args.data.R1,
                R2: args.data.R2,
                M: args.data.M
            }
        });
        if (!transformer) {
            throw new Error('Нет такого трансформатора');
        }
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: transformer.schemaId
        })
        return 'Значения трансформатора успешно изменены';

    }
})


export const addTransformer = mutationField('addTransformer', {
    description: 'add transformer to Schema',
    type: "transformer",
    args: {
        schemaId: nonNull(intArg()),
        data: nonNull('InputTransformers'),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы')
        }
        const transformer = await ctx.prisma.transformer.create({
            data: {
                schemaId: args.schemaId,
                pFirstNode: args.data.pFirstNode,
                mFirstNode: args.data.mFirstNode,
                pSecondNode: args.data.pSecondNode,
                mSecondNode: args.data.mSecondNode,
                L1: args.data.L1,
                L2: args.data.L2,
                R1: args.data.R1,
                R2: args.data.R2,
                M: args.data.M
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: args.schemaId
            },
            data: {
                ntr: {increment: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: args.schemaId
        })
        return transformer;

    }
})

export const deleteTransformer = mutationField('deleteTransformer', {
    description: 'delete transformer in Schema',
    type: "String",
    args: {
        elemId: nonNull(intArg()),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const transformer = await ctx.prisma.transformer.delete({
            where: {
                id: args.elemId
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: transformer.schemaId
            },
            data: {
                ntr: {decrement: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: transformer.schemaId
        })

        return 'Трансформатор успешно удалён';

    }
})

export const changeIdealTransformer = mutationField('changeIdealTransformer', {
    description: 'Change ideal transformer in Schema',
    type: "String",
    args: {
        elemId: nonNull(intArg()),
        data: nonNull('InputIdealTransformersType')
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const idealTransformer = await ctx.prisma.idealTransformer.update({
            where: {
                id: args.elemId
            },
            data: {
                pFirstNode: args.data.pFirstNode,
                mFirstNode: args.data.mFirstNode,
                pSecondNode: args.data.pSecondNode,
                mSecondNode: args.data.mSecondNode,
                gain: args.data.gain
            }
        });
        if (!idealTransformer) {
            throw new Error('Нет такого трансформатора');
        }
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: idealTransformer.schemaId
        })
        return 'Значения идеального трансформатора успешно изменены';

    }
})


export const addIdealTransformer = mutationField('addIdealTransformer', {
    description: 'add ideal transformer to Schema',
    type: "idealTransformer",
    args: {
        schemaId: nonNull(intArg()),
        data: nonNull('InputIdealTransformersType'),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы')
        }
        const idealTransformer = await ctx.prisma.idealTransformer.create({
            data: {
                schemaId: args.schemaId,
                pFirstNode: args.data.pFirstNode,
                mFirstNode: args.data.mFirstNode,
                pSecondNode: args.data.pSecondNode,
                mSecondNode: args.data.mSecondNode,
                gain: args.data.gain,
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: args.schemaId
            },
            data: {
                ntri: {increment: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: args.schemaId
        })
        return idealTransformer;

    }
})

export const deleteIdealTransformer = mutationField('deleteIdealTransformer', {
    description: 'delete ideal transformer in Schema',
    type: "String",
    args: {
        elemId: nonNull(intArg()),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const idealTransformer = await ctx.prisma.idealTransformer.delete({
            where: {
                id: args.elemId
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: idealTransformer.schemaId
            },
            data: {
                ntri: {decrement: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: idealTransformer.schemaId
        })
        return 'Идеальный трансформатор успешно удалён';

    }
})

export const changeOperationAmplifier = mutationField('changeOperationAmplifier', {
    description: 'Change operation amplifier in Schema',
    type: "String",
    args: {
        elemId: nonNull(intArg()),
        data: nonNull('InputOperationAmplifiersType')
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const operationAmplifier = await ctx.prisma.operationAmplifier.update({
            where: {
                id: args.elemId
            },
            data: {
                pFirstNode: args.data.pFirstNode,
                mFirstNode: args.data.mFirstNode,
                pSecondNode: args.data.pSecondNode,
                mSecondNode: args.data.mSecondNode,
                fT: args.data.fT,
                rIn: args.data.rIn,
                rOut: args.data.rOut,
                u: args.data.u
            }
        });
        if (!operationAmplifier) {
            throw new Error('Нет такого операционного усилителя');
        }
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: operationAmplifier.schemaId
        })
        return 'Значения операционного усилителя успешно изменены';

    }
})


export const addOperationAmplifier = mutationField('addOperationAmplifier', {
    description: 'add operation amplifier to Schema',
    type: "operationAmplifier",
    args: {
        schemaId: nonNull(intArg()),
        data: nonNull('InputOperationAmplifiersType'),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы')
        }
        const operationAmplifier = await ctx.prisma.operationAmplifier.create({
            data: {
                schemaId: args.schemaId,
                pFirstNode: args.data.pFirstNode,
                mFirstNode: args.data.mFirstNode,
                pSecondNode: args.data.pSecondNode,
                mSecondNode: args.data.mSecondNode,
                fT: args.data.fT,
                rIn: args.data.rIn,
                rOut: args.data.rOut,
                u: args.data.u
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: args.schemaId
            },
            data: {
                nou: {increment: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: args.schemaId
        })
        return operationAmplifier;

    }
})

export const deleteOperationAmplifier = mutationField('deleteOperationAmplifier', {
    description: 'delete operation Amplifier in Schema',
    type: "String",
    args: {
        elemId: nonNull(intArg()),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const operationAmplifier = await ctx.prisma.operationAmplifier.delete({
            where: {
                id: args.elemId
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: operationAmplifier.schemaId
            },
            data: {
                nou: {decrement: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: operationAmplifier.schemaId
        })
        return 'Операционный усилитель успешно удалён';

    }
})

export const changeIdealOperationAmplifier = mutationField('changeIdealOperationAmplifier', {
    description: 'Change ideal operation amplifier in Schema',
    type: "String",
    args: {
        elemId: nonNull(intArg()),
        data: nonNull('InputIdealOperationAmplifiersType')
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const idealOperationAmplifier = await ctx.prisma.idealOperationAmplifier.update({
            where: {
                id: args.elemId
            },
            data: {
                pFirstNode: args.data.pFirstNode,
                mFirstNode: args.data.mFirstNode,
                pSecondNode: args.data.pSecondNode,
                mSecondNode: args.data.mSecondNode,
            }
        });
        if (!idealOperationAmplifier) {
            throw new Error('Нет такого идеального операционного усилителя');
        }
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: idealOperationAmplifier.schemaId
        })
        return 'Значения идеального операционного усилителя успешно изменены';

    }
})


export const addIdealOperationAmplifier = mutationField('addIdealOperationAmplifier', {
    description: 'add ideal operation amplifier to Schema',
    type: "idealOperationAmplifier",
    args: {
        schemaId: nonNull(intArg()),
        data: nonNull('InputIdealOperationAmplifiersType'),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы')
        }
        const idealOperationAmplifier = await ctx.prisma.idealOperationAmplifier.create({
            data: {
                schemaId: args.schemaId,
                pFirstNode: args.data.pFirstNode,
                mFirstNode: args.data.mFirstNode,
                pSecondNode: args.data.pSecondNode,
                mSecondNode: args.data.mSecondNode,
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: args.schemaId
            },
            data: {
                noui: {increment: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: args.schemaId
        })
        return idealOperationAmplifier;

    }
})

export const deleteIdealOperationAmplifier = mutationField('deleteIdealOperationAmplifier', {
    description: 'delete ideal operation amplifier in Schema',
    type: "String",
    args: {
        elemId: nonNull(intArg()),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const idealOperationAmplifier = await ctx.prisma.idealOperationAmplifier.delete({
            where: {
                id: args.elemId
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: idealOperationAmplifier.schemaId
            },
            data: {
                noui: {decrement: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: idealOperationAmplifier.schemaId
        })
        return 'Идеальный операционный усилитель успешно удалён';

    }
})

export const changeVCCS = mutationField('changeVCCS', {
    description: 'Change VCCS and VCCS freq depended elem',
    type: 'String',
    args: {
        elemId: nonNull(intArg()),
        data: nonNull('InputControlledSource')
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const VCCS = await ctx.prisma.vCCS.update({
            where: {
                id: args.elemId
            },
            data: {
                pFirstNode: args.data.pFirstNode,
                mFirstNode: args.data.mFirstNode,
                pSecondNode: args.data.pSecondNode,
                mSecondNode: args.data.mSecondNode,
                transmission: args.data.transmission,
                T1: args.data.T1!,
                T2: args.data.T2!
            }
        });
        if (!VCCS) {
            throw new Error('Нет такого ИТУН');
        }
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: VCCS.schemaId
        })
        return 'Значения ИТУН успешно изменены';
    }
})

export const addVCCS = mutationField('addVCCS', {
    description: 'add VCCS or VCCS freq depended to schema',
    type: 'VCCS',
    args: {
        schemaId: nonNull(intArg()),
        data: nonNull('InputControlledSource'),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы')
        }
        const VCCS = await ctx.prisma.vCCS.create({
            data: {
                schemaId: args.schemaId,
                pFirstNode: args.data.pFirstNode,
                mFirstNode: args.data.mFirstNode,
                pSecondNode: args.data.pSecondNode,
                mSecondNode: args.data.mSecondNode,
                transmission: args.data.transmission,
                T1: args.data.T1!,
                T2: args.data.T2!
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: args.schemaId
            },
            data: {
                nev: {increment: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: args.schemaId
        })
        return VCCS;

    }
});

export const deleteVCCS = mutationField('deleteVCCS', {
    description: 'delete VCCS in schema',
    type: 'String',
    args: {
        elemId: nonNull(intArg()),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const VCCS = await ctx.prisma.vCCS.delete({
            where: {
                id: args.elemId
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: VCCS.schemaId
            },
            data: {
                nev: {decrement: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: VCCS.schemaId
        })
        return 'ИТУН успешно удалён';
    }
})

export const changeCCCS = mutationField('changeCCCS', {
    description: 'Change CCCS and CCCS freq depended elem',
    type: 'String',
    args: {
        elemId: nonNull(intArg()),
        data: nonNull('InputControlledSource')
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const CCCS = await ctx.prisma.cCCS.update({
            where: {
                id: args.elemId
            },
            data: {
                pFirstNode: args.data.pFirstNode,
                mFirstNode: args.data.mFirstNode,
                pSecondNode: args.data.pSecondNode,
                mSecondNode: args.data.mSecondNode,
                transmission: args.data.transmission,
                T1: args.data.T1!,
                T2: args.data.T2!
            }
        });
        if (!CCCS) {
            throw new Error('Нет такого ИТУТ');
        }
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: CCCS.schemaId
        })
        return 'Значения ИТУТ успешно изменены';
    }
})

export const addCCCS = mutationField('addCCCS', {
    description: 'add CCCS or CCCS freq depended to schema',
    type: 'CCCS',
    args: {
        schemaId: nonNull(intArg()),
        data: nonNull('InputControlledSource'),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы')
        }
        const CCCS = await ctx.prisma.cCCS.create({
            data: {
                schemaId: args.schemaId,
                pFirstNode: args.data.pFirstNode,
                mFirstNode: args.data.mFirstNode,
                pSecondNode: args.data.pSecondNode,
                mSecondNode: args.data.mSecondNode,
                transmission: args.data.transmission,
                T1: args.data.T1!,
                T2: args.data.T2!
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: args.schemaId
            },
            data: {
                nji: {increment: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: args.schemaId
        })
        return CCCS;

    }
});

export const deleteCCCS = mutationField('deleteCCCS', {
    description: 'delete CCCS in schema',
    type: 'String',
    args: {
        elemId: nonNull(intArg()),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const CCCS = await ctx.prisma.cCCS.delete({
            where: {
                id: args.elemId
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: CCCS.schemaId
            },
            data: {
                nji: {decrement: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: CCCS.schemaId
        })
        return 'ИТУТ успешно удалён';
    }
})

export const changeVCVS = mutationField('changeVCVS', {
    description: 'Change VCVS and VCVS freq depended elem',
    type: 'String',
    args: {
        elemId: nonNull(intArg()),
        data: nonNull('InputControlledSource')
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const VCVS = await ctx.prisma.cCCS.update({
            where: {
                id: args.elemId
            },
            data: {
                pFirstNode: args.data.pFirstNode,
                mFirstNode: args.data.mFirstNode,
                pSecondNode: args.data.pSecondNode,
                mSecondNode: args.data.mSecondNode,
                transmission: args.data.transmission,
                T1: args.data.T1!,
                T2: args.data.T2!
            }
        });
        if (!VCVS) {
            throw new Error('Нет такого ИНУН');
        }
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: VCVS.schemaId
        })
        return 'Значения ИНУН успешно изменены';
    }
})

export const addVCVS = mutationField('addVCVS', {
    description: 'add VCVS or VCVS freq depended to schema',
    type: 'VCVS',
    args: {
        schemaId: nonNull(intArg()),
        data: nonNull('InputControlledSource'),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы')
        }
        const VCVS = await ctx.prisma.vCVS.create({
            data: {
                schemaId: args.schemaId,
                pFirstNode: args.data.pFirstNode,
                mFirstNode: args.data.mFirstNode,
                pSecondNode: args.data.pSecondNode,
                mSecondNode: args.data.mSecondNode,
                transmission: args.data.transmission,
                T1: args.data.T1!,
                T2: args.data.T2!
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: args.schemaId
            },
            data: {
                nju: {increment: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: args.schemaId
        })
        return VCVS;

    }
});

export const deleteVCVS = mutationField('deleteVCVS', {
    description: 'delete VCVS in schema',
    type: 'String',
    args: {
        elemId: nonNull(intArg()),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const VCVS = await ctx.prisma.vCVS.delete({
            where: {
                id: args.elemId
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: VCVS.schemaId
            },
            data: {
                nju: {decrement: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: VCVS.schemaId
        })
        return 'ИНУН успешно удалён';
    }
})

export const changeCCVS = mutationField('changeCCVS', {
    description: 'Change CCVS and CCVS freq depended elem',
    type: 'String',
    args: {
        elemId: nonNull(intArg()),
        data: nonNull('InputControlledSource')
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const CCVS = await ctx.prisma.cCCS.update({
            where: {
                id: args.elemId
            },
            data: {
                pFirstNode: args.data.pFirstNode,
                mFirstNode: args.data.mFirstNode,
                pSecondNode: args.data.pSecondNode,
                mSecondNode: args.data.mSecondNode,
                transmission: args.data.transmission,
                T1: args.data.T1!,
                T2: args.data.T2!
            }
        });
        if (!CCVS) {
            throw new Error('Нет такого ИНУТ');
        }
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: CCVS.schemaId
        })
        return 'Значения ИНУТ успешно изменены';
    }
})

export const addCCVS = mutationField('addCCVS', {
    description: 'add CCVS or CCVS freq depended to schema',
    type: 'CCVS',
    args: {
        schemaId: nonNull(intArg()),
        data: nonNull('InputControlledSource'),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы')
        }
        const CCVS = await ctx.prisma.cCVS.create({
            data: {
                schemaId: args.schemaId,
                pFirstNode: args.data.pFirstNode,
                mFirstNode: args.data.mFirstNode,
                pSecondNode: args.data.pSecondNode,
                mSecondNode: args.data.mSecondNode,
                transmission: args.data.transmission,
                T1: args.data.T1!,
                T2: args.data.T2!
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: args.schemaId
            },
            data: {
                nei: {increment: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: args.schemaId
        })
        return CCVS;

    }
});

export const deleteCCVS = mutationField('deleteCCVS', {
    description: 'delete CCVS in schema',
    type: 'String',
    args: {
        elemId: nonNull(intArg()),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const CCVS = await ctx.prisma.cCVS.delete({
            where: {
                id: args.elemId
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: CCVS.schemaId
            },
            data: {
                nei: {decrement: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: CCVS.schemaId
        })
        return 'ИНУТ успешно удалён';
    }
})

export const changeBipolarTransistor = mutationField('changeBipolarTransistor', {
    description: 'Change changeBipolarTransistor elem',
    type: 'String',
    args: {
        elemId: nonNull(intArg()),
        data: nonNull('InputBipolarTransistors')
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const bipolarTransistor = await ctx.prisma.bipolarTransistor.update({
            where: {
                id: args.elemId
            },
            data: {
                ne: args.data.ne,
                nc: args.data.nc,
                nb: args.data.nb,
                Rb: args.data.Rb,
                Re: args.data.Re,
                Rc: args.data.Rc,
                Ce: args.data.Ce,
                Cc: args.data.Cc,
                b: args.data.b
            }
        });
        if (!bipolarTransistor) {
            throw new Error('Нет такого биполярного транзистора');
        }
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: bipolarTransistor.schemaId
        })
        return 'Значения биполярного транзистора успешно изменены';
    }
})

export const addBipolarTransistor = mutationField('addBipolarTransistor', {
    description: 'add bipolar transistor to schema',
    type: 'bipolarTransistor',
    args: {
        schemaId: nonNull(intArg()),
        data: nonNull('InputBipolarTransistors'),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы')
        }
        const bipolarTransistor = await ctx.prisma.bipolarTransistor.create({
            data: {
                schemaId: args.schemaId,
                ne: args.data.ne,
                nc: args.data.nc,
                nb: args.data.nb,
                Rb: args.data.Rb,
                Re: args.data.Re,
                Rc: args.data.Rc,
                Ce: args.data.Ce,
                Cc: args.data.Cc,
                b: args.data.b
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: args.schemaId
            },
            data: {
                ntb: {increment: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: args.schemaId
        })
        return bipolarTransistor;

    }
});

export const deleteBipolarTransistor = mutationField('deleteBipolarTransistor', {
    description: 'delete bipolar transistor in schema in schema',
    type: 'String',
    args: {
        elemId: nonNull(intArg()),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const bipolarTransistor = await ctx.prisma.bipolarTransistor.delete({
            where: {
                id: args.elemId
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: bipolarTransistor.schemaId
            },
            data: {
                ntb: {decrement: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: bipolarTransistor.schemaId
        })
        return 'Биполярный транзистор успешно удалён';
    }
})

export const changeUnipolarTransistor = mutationField('changeUnipolarTransistor', {
    description: 'Change changeUnipolarTransistor elem',
    type: 'String',
    args: {
        elemId: nonNull(intArg()),
        data: nonNull('InputUnipolarTransistors')
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const unipolarTransistor = await ctx.prisma.unipolarTransistor.update({
            where: {
                id: args.elemId
            },
            data: {
                nz: args.data.nz,
                ns: args.data.ns,
                ni: args.data.ni,
                Rc: args.data.Rc,
                Czi: args.data.Czi,
                Czs: args.data.Czs,
                Csi: args.data.Csi,
                S: args.data.S
            }
        });
        if (!unipolarTransistor) {
            throw new Error('Нет такого униполярного транзистора');
        }
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: unipolarTransistor.schemaId
        })
        return 'Значения униполярного транзистора успешно изменены';
    }
})

export const addUnipolarTransistor = mutationField('addUnipolarTransistor', {
    description: 'add unipolar transistor to schema',
    type: 'unipolarTransistor',
    args: {
        schemaId: nonNull(intArg()),
        data: nonNull('InputUnipolarTransistors'),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы')
        }
        const unipolarTransistor = await ctx.prisma.unipolarTransistor.create({
            data: {
                schemaId: args.schemaId,
                nz: args.data.nz,
                ns: args.data.ns,
                ni: args.data.ni,
                Rc: args.data.Rc,
                Czi: args.data.Czi,
                Czs: args.data.Czs,
                Csi: args.data.Csi,
                S: args.data.S
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: args.schemaId
            },
            data: {
                ntu: {increment: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: args.schemaId
        })
        return unipolarTransistor;

    }
});

export const deleteUnipolarTransistor = mutationField('deleteUnipolarTransistor', {
    description: 'delete unipolar transistor in schema in schema',
    type: 'String',
    args: {
        elemId: nonNull(intArg()),
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const unipolarTransistor = await ctx.prisma.unipolarTransistor.delete({
            where: {
                id: args.elemId
            }
        });
        await ctx.prisma.schema.update({
            where: {
                id: unipolarTransistor.schemaId
            },
            data: {
                ntu: {decrement: 1}
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: unipolarTransistor.schemaId
        })
        return 'Униполярный транзистор успешно удалён';
    }
})


export const changeInNode = mutationField('changeInNode', {
    description: 'change input node',
    type: 'CalculationDirectives',
    args: {
        schemaId: nonNull(intArg()),
        plus: nonNull(intArg()),
        minus: nonNull(intArg())
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        });
        if (!schema) {
            throw new Error('нет такой схемы');
        }
        const inNodes = await ctx.prisma.calculationDirectives.update({
            where: {
                schemaId: args.schemaId
            },
            data: {
                inNodeM: args.minus,
                inNodeP: args.plus
            }
        });
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: args.schemaId
        })
        return inNodes;
    }
})

export const changeOutNode = mutationField('changeOutNode', {
    description: 'change output node',
    type: 'CalculationDirectives',
    args: {
        schemaId: nonNull(intArg()),
        plus: nonNull(intArg()),
        minus: nonNull(intArg())
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.findUnique({
            where: {
                id: args.schemaId
            }
        });
        if (!schema) {
            throw new Error('нет такой схемы');
        }
        const outNodes = await ctx.prisma.calculationDirectives.update({
            where: {
                schemaId: args.schemaId
            },
            data: {
                outNodeM: args.minus,
                outNodeP: args.plus
            }
        })
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: args.schemaId
        })
       return  outNodes;
    }
})


export const subscriptionType = objectType( {
    name: 'schemaChanged',
    definition(t) {
        t.int('schemaId')
    }
})

export const schemaSubscription = subscriptionField('schemaSubscription', {
        type: list('SchemaResults'),
        subscribe: (_,__,ctx) => ctx.pubsub.asyncIterator('SCHEMA_CHANGED')
    ,
        //@ts-ignore
        async resolve(data: SchemaChanged,args,ctx,_) {
            console.log('data is...');
            console.log(data);



            const calculationDirectives = await ctx.prisma.calculationDirectives.findUnique({
                where: {
                    schemaId: data.schemaId
                }
            })
            const schema = await ctx.prisma.schema.findUnique({
                where: {
                    id: data.schemaId
                }
            })

            const resistors = await ctx.prisma.resistor.findMany({
                where: {
                    schemaId: data.schemaId
                }
            });
            const inductors = await ctx.prisma.inductor.findMany({
                where: {
                    schemaId: data.schemaId
                }
            });
            const capacitors = await ctx.prisma.capacitor.findMany({
                where: {
                    schemaId: data.schemaId
                }
            })
            const VCCSs = await ctx.prisma.vCCS.findMany({
                where: {
                    schemaId: data.schemaId
                }
            })
            const VCVSs = await ctx.prisma.vCVS.findMany({
                where: {
                    schemaId: data.schemaId
                }
            })
            const CCCSs = await ctx.prisma.cCCS.findMany({
                where: {
                    schemaId: data.schemaId
                }
            })
            const CCVSs = await ctx.prisma.cCVS.findMany({
                where: {
                    schemaId: data.schemaId
                }
            });

            const transformers = await ctx.prisma.transformer.findMany({
                where: {
                    schemaId: data.schemaId
                }
            });
            const idealTransformers = await ctx.prisma.idealTransformer.findMany({
                where: {
                    schemaId: data.schemaId
                }
            });

            const operationAmplifiers = await ctx.prisma.operationAmplifier.findMany({
                where: {
                    schemaId: data.schemaId
                }
            });
            const idealOperationAmplifiers = await ctx.prisma.idealOperationAmplifier.findMany({
                where: {
                    schemaId: data.schemaId
                }
            });
            const bipolarTransistors = await ctx.prisma.bipolarTransistor.findMany({
                where: {
                    schemaId: data.schemaId
                }
            });
            let unipolarTransistors = await ctx.prisma.unipolarTransistor.findMany({
                where: {
                    schemaId: data.schemaId
                }
            })
            let functionArgs = {
                first: calculationDirectives!.first,
                second: calculationDirectives!.second,
                third: calculationDirectives!.third
            };
            const inNode = {
                positive: calculationDirectives!.inNodeP,
                negative: calculationDirectives!.inNodeM
            }
            const outNode = {
                positive:calculationDirectives!.outNodeP,
                negative: calculationDirectives!.outNodeM
            }
            const calculations = new Calculations({
                functionType: calculationDirectives!.functionType,
                functionArgs,
                nodes: schema!.nv,
                capacitors: capacitors.length === 0 ? undefined : capacitors,
                resistors: resistors.length === 0 ? undefined : resistors,
                sourceIn: inNode,
                sourceOut: outNode,
                inductors: inductors.length === 0 ? undefined : inductors,
                idealOperationAmplifiers: idealOperationAmplifiers.length === 0 ? undefined : idealOperationAmplifiers,
                operationAmplifiers: operationAmplifiers.length === 0 ? undefined : operationAmplifiers,
                transformers: transformers.length === 0 ? undefined : transformers,
                idealTransformers: idealTransformers.length === 0 ? undefined : idealTransformers,
                bipolarTransistors: bipolarTransistors.length === 0 ? undefined : bipolarTransistors,
                unipolarTransistors: unipolarTransistors.length === 0 ? undefined : unipolarTransistors,
                VCCSsAll: VCCSs.length === 0 ? undefined : VCCSs,
                VCVSsAll: VCVSs.length === 0 ? undefined : VCVSs,
                CCCSsAll: CCCSs.length === 0 ? undefined : CCCSs,
                CCVSsAll: CCVSs.length === 0 ? undefined : CCVSs
            })
            await ctx.prisma.schemaResults.deleteMany({
                where: {
                    schemaId: data.schemaId
                }
            });
            const results = calculations.calculateElemsComplex();
            console.log('results is...');
            console.log(results);
            const newResults = results.map((elem:any) => ({...elem, schemaId: data.schemaId}));
            await ctx.prisma.schemaResults.createMany({
                    data: newResults
                }
            )

            return results;
        }
    }
)

export const changeFunction = mutationField('changeFunction', {
    type: "String",
    description: 'change function in calculation directives',
    args: {
        schemaId: nonNull(intArg()),
        type: nonNull('FunctionType'),
        first: nonNull(floatArg()),
        second: nonNull(floatArg()),
        third: nonNull(floatArg())
    },
    authorize: (_, __, ctx) => ctx.user.role !== 'VIEWER',
    async resolve(_,args,ctx) {
        const calculationDirectives = await ctx.prisma.calculationDirectives.update({
            where: {
                schemaId: args.schemaId
            },
            data: {
                functionType: args.type,
                first: args.first,
                second: args.second,
                third: args.third
            }
        })
        if (!calculationDirectives) {
            throw new Error('Нет такой схемы');
        }
        await ctx.pubsub.publish('SCHEMA_CHANGED', {
            schemaId: args.schemaId
        })
        return 'Схема успешно изменена'

    }
})

export const changeNodes = mutationField('changeNodes', {
    description: 'change nodes in schema',
    type: 'String',
    args: {
        schemaId: nonNull(intArg()),
        nodes: nonNull(intArg()),
    },
    async resolve(_,args,ctx) {
        const schema = await ctx.prisma.schema.update({
            where: {
                id: args.schemaId
            },
            data: {
                nv: args.nodes,
            }
        })
        if (!schema) {
            throw new Error('Нет такой схемы');
        }
        return 'Число узлов успешно изменено'
    }
})

