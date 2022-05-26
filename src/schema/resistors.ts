import {Resistor} from 'nexus-prisma'
import {extendType, inputObjectType, intArg, list, objectType} from "nexus";
import {AuthenticationError} from "apollo-server-micro";
const jwt = require('jwt-then')


export const ResistorObject = objectType({
    name: Resistor.$name,
    definition(t) {
        t.field(Resistor.id)
        t.field(Resistor.schemaId)
        t.field(Resistor.resistance)
        t.field(Resistor.pNode)
        t.field(Resistor.mNode)
    },
});

export const InputResistorsType = inputObjectType({
    name: 'InputResistorsType',
    definition(t) {
        t.nonNull.float('resistance')
        t.nonNull.int('pNode')
        t.nonNull.int('mNode')
    }
})
