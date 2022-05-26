import {Capacitor} from 'nexus-prisma'
import {extendType, inputObjectType, intArg, list, objectType} from "nexus";
import {AuthenticationError} from "apollo-server-micro";
const jwt = require('jwt-then')


export const CapacitorObject = objectType({
    name: Capacitor.$name,
    definition(t) {
        t.field(Capacitor.id)
        t.field(Capacitor.schemaId)
        t.field(Capacitor.capacity)
        t.field(Capacitor.pNode)
        t.field(Capacitor.mNode)
    },
});

export const InputCapacitorsType = inputObjectType({
    name: 'InputCapacitorsType',
    definition(t) {
        t.nonNull.int('capacity')
        t.nonNull.int('pNode')
        t.nonNull.int('mNode')
    }
})
