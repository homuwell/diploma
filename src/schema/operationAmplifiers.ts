import {operationAmplifier} from 'nexus-prisma'
import {extendType, inputObjectType, intArg, list, objectType} from "nexus";

const jwt = require('jwt-then')

export const operationAmplifierType = objectType({
    name: operationAmplifier.$name,
    definition(t) {
        t.field(operationAmplifier.id)
        t.field(operationAmplifier.pFirstNode)
        t.field(operationAmplifier.mFirstNode)
        t.field(operationAmplifier.pSecondNode)
        t.field(operationAmplifier.mSecondNode)
        t.field(operationAmplifier.rIn)
        t.field(operationAmplifier.rOut)
        t.field(operationAmplifier.u)
        t.field(operationAmplifier.fT)
    }
})

export const InputOperationAmplifiersType = inputObjectType({
    name: 'InputOperationAmplifiersType',
    definition(t) {
        t.nonNull.int('mFirstNode')
        t.nonNull.int('pFirstNode')
        t.nonNull.int('mSecondNode')
        t.nonNull.int('pSecondNode')
        t.nonNull.int('rIn')
        t.nonNull.int('rOut')
        t.nonNull.int('u')
        t.nonNull.int('fT')
    }
})
