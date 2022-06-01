import {idealOperationAmplifier} from 'nexus-prisma'
import {extendType, inputObjectType, intArg, list, objectType} from "nexus";
const jwt = require('jwt-then')

export const idealOperationAmplifierType = objectType({
    name: idealOperationAmplifier.$name,
    definition(t) {
        t.field(idealOperationAmplifier.id)
        t.field(idealOperationAmplifier.pFirstNode)
        t.field(idealOperationAmplifier.mFirstNode)
        t.field(idealOperationAmplifier.pSecondNode)
        t.field(idealOperationAmplifier.mSecondNode)
    }
})
export const inputIdealOperationAmplifiersType = inputObjectType({
        name: 'InputIdealOperationAmplifiersType',
    definition(t) {
        t.nonNull.int('mFirstNode')
        t.nonNull.int('pFirstNode')
        t.nonNull.int('mSecondNode')
        t.nonNull.int('pSecondNode')
    }
    }
)
