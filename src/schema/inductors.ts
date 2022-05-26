import {Inductor} from 'nexus-prisma'
import {extendType, inputObjectType, intArg, list, objectType} from "nexus";
import {AuthenticationError} from "apollo-server-micro";
const jwt = require('jwt-then')


export const InductorObject = objectType({
    name: Inductor.$name,
    definition(t) {
        t.field(Inductor.id)
        t.field(Inductor.schemaId)
        t.field(Inductor.induction)
        t.field(Inductor.pNode)
        t.field(Inductor.mNode)
    },
});

export const InputInductorsType = inputObjectType({
    name: 'InputInductorsType',
    definition(t) {
        t.nonNull.int('induction')
        t.nonNull.int('pNode')
        t.nonNull.int('mNode')
    }
})

