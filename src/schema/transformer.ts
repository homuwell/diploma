import {transformer} from 'nexus-prisma'
import {extendType, inputObjectType, intArg, list, objectType} from "nexus";
const jwt = require('jwt-then')

export const transformerType = objectType({
    name: transformer.$name,
    definition(t) {
        t.field(transformer.id)
        t.field(transformer.mFirstNode)
        t.field(transformer.pFirstNode)
        t.field(transformer.mSecondNode)
        t.field(transformer.pSecondNode)
        t.field(transformer.M)
        t.field(transformer.R1)
        t.field(transformer.R2)
        t.field(transformer.L1)
        t.field(transformer.L2)

    }
})

export const InputTransformers = inputObjectType({
    name: 'InputTransformers',
    definition(t) {
        t.nonNull.int('mFirstNode')
        t.nonNull.int('pFirstNode')
        t.nonNull.int('mSecondNode')
        t.nonNull.int('pSecondNode')
        t.nonNull.int('M')
        t.nonNull.int('R1')
        t.nonNull.int('R2')
        t.nonNull.int('L1')
        t.nonNull.int('L2')
    }
})
