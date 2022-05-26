import {idealTransformer} from 'nexus-prisma'
import {extendType, inputObjectType, intArg, list, objectType} from "nexus";

export const idealTransformerType = objectType({
    name: idealTransformer.$name,
    definition(t) {
        t.field(idealTransformer.id)
        t.field(idealTransformer.mFirstNode)
        t.field(idealTransformer.pFirstNode)
        t.field(idealTransformer.mSecondNode)
        t.field(idealTransformer.pSecondNode)
        t.field(idealTransformer.gain)
    }
})

export const InputIdealTransformersType = inputObjectType({
    name: 'InputIdealTransformersType',
    definition(t) {
        t.nonNull.int('mFirstNode')
        t.nonNull.int('pFirstNode')
        t.nonNull.int('mSecondNode')
        t.nonNull.int('pSecondNode')
        t.nonNull.int('gain')
    }
})
