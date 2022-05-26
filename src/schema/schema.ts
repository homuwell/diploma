import {Schema} from 'nexus-prisma'
import {inputObjectType, objectType} from "nexus";



export const InputControlledSource = inputObjectType({
    name: 'InputControlledSource',
    definition(t) {
        t.nonNull.int('mFirstNode')
        t.nonNull.int('pFirstNode')
        t.nonNull.int('mSecondNode')
        t.nonNull.int('pSecondNode')
        t.float('T1',{default: 0})
        t.float('T2',{default: 0})
        t.nonNull.float('transmission')

    }
})


export const SchemaObject = objectType({
    name: Schema.$name,
    definition(t) {
        t.field(Schema.id)
        t.field(Schema.UserId)
        t.field(Schema.nv)
        t.field(Schema.nr)
        t.field(Schema.name)
        t.field(Schema.nc)
        t.field(Schema.nl)
        t.field(Schema.nf)
        t.field(Schema.nju)
        t.field(Schema.nev)
        t.field(Schema.ntri)
        t.field(Schema.nou)
        t.field(Schema.noui)
        t.field(Schema.nei)
        t.field(Schema.nji)
        t.field(Schema.ntr)
        t.field(Schema.ntb)
        t.field(Schema.ntu)
        t.list.field('resistors', {
            type:  "Resistor",
            async resolve(parent, __,ctx) {
                return await ctx.prisma.resistor.findMany({
                    where: {
                        schemaId: parent.id
                    }
                })

            }
        })
        t.list.field('capacitors', {
            type:  "Capacitor",
            async resolve(parent, __,ctx) {
                return await ctx.prisma.capacitor.findMany({
                    where: {
                        schemaId: parent.id
                    }
                })

            }
        })
        t.list.field('inductors', {
            type:  "Inductor",
            async resolve(parent, __,ctx) {
                return await ctx.prisma.inductor.findMany({
                    where: {
                        schemaId: parent.id
                    }
                })

            }
        })
        t.list.field('VCCSs', {
            type:  "VCCS",
            async resolve(parent, __,ctx) {
                return await ctx.prisma.vCCS.findMany({
                    where: {
                        schemaId: parent.id,
                        T1: 0,
                        T2: 0
                    }
                })

            }
        })
        t.list.field('VCCSsFreqDependent', {
            type:  "VCCS",
            async resolve(parent, __,ctx) {
                return await ctx.prisma.vCCS.findMany({
                    where: {
                        schemaId: parent.id,
                        OR: [
                            {
                                T1: {not: 0}
                            },
                            {
                                T2: {not: 0}
                            }
                        ],
                    }
                })

            }
        })

        t.list.field('VCVSs', {
            type:  "VCVS",
            async resolve(parent, __,ctx) {
                return await ctx.prisma.vCVS.findMany({
                    where: {
                        schemaId: parent.id,
                        T1: 0,
                        T2: 0
                    }
                })

            }
        })
        t.list.field('VCVSsFreqDependent', {
            type:  "VCVS",
            async resolve(parent, __,ctx) {
                return await ctx.prisma.vCVS.findMany({
                    where: {
                        schemaId: parent.id,
                        OR: [
                            {
                                T1: {not: 0}
                            },
                            {
                                T2: {not: 0}
                            }
                        ],
                    }
                })

            }
        })

        t.list.field('CCCSs', {
            type:  "CCCS",
            async resolve(parent, __,ctx) {
                return await ctx.prisma.cCCS.findMany({
                    where: {
                        schemaId: parent.id,
                        T1: 0,
                        T2: 0
                    }
                })

            }
        })
        t.list.field('CCCSsFreqDependent', {
            type:  "CCCS",
            async resolve(parent, __,ctx) {
                return await ctx.prisma.cCCS.findMany({
                    where: {
                        schemaId: parent.id,
                        OR: [
                            {
                                T1: {not: 0}
                            },
                            {
                                T2: {not: 0}
                            }
                        ],
                    }
                })

            }
        })

        t.list.field('CCVSs', {
            type:  "CCVS",
            async resolve(parent, __,ctx) {
                return await ctx.prisma.cCVS.findMany({
                    where: {
                        schemaId: parent.id,
                        T1: 0,
                        T2: 0
                    }
                })

            }
        })
        t.list.field('CCVSsFreqDependent', {
            type:  "CCVS",
            async resolve(parent, __,ctx) {
                return await ctx.prisma.cCVS.findMany({
                    where: {
                        schemaId: parent.id,
                        OR: [
                            {
                                T1: {not: 0}
                            },
                            {
                                T2: {not: 0}
                            }
                        ],
                    }
                })

            }
        })
        t.list.field('transformers', {
            type: 'transformer',
            async resolve(parent,__,ctx) {
                return await ctx.prisma.transformer.findMany({
                    where: {
                        schemaId: parent.id
                    }
                })
            }
        })
        t.list.field('idealTransformers', {
            type:  "idealTransformer",
            async resolve(parent, __,ctx) {
                return await ctx.prisma.idealTransformer.findMany({
                    where: {
                        schemaId: parent.id
                    }
                })

            }
        })
        t.list.field('operationAmplifiers', {
            type:  "operationAmplifier",
            async resolve(parent, __,ctx) {
                return await ctx.prisma.operationAmplifier.findMany({
                    where: {
                        schemaId: parent.id
                    }
                })

            }
        })
        t.list.field('idealOperationAmplifiers', {
            type:  "idealOperationAmplifier",
            async resolve(parent, __,ctx) {
                return await ctx.prisma.idealOperationAmplifier.findMany({
                    where: {
                        schemaId: parent.id
                    }
                })

            }
        })
        t.list.field('bipolarTransistors', {
            type:  "bipolarTransistor",
            async resolve(parent, __,ctx) {
                return await ctx.prisma.bipolarTransistor.findMany({
                    where: {
                        schemaId: parent.id
                    }
                })

            }
        })
        t.list.field('unipolarTransistors', {
            type:  "unipolarTransistor",
            async resolve(parent, __,ctx) {
                return await ctx.prisma.unipolarTransistor.findMany({
                    where: {
                        schemaId: parent.id
                    }
                })

            }
        })
        t.field('calculationDirectives', {
            type: 'CalculationDirectives',
            async resolve(parent, __, ctx) {
                return await ctx.prisma.calculationDirectives.findUnique({
                    where: {
                        schemaId: parent.id
                    }
                })
            }
        })

    },
});

