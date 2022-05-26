import {VCCS} from 'nexus-prisma'
import {extendType, inputObjectType, intArg, list, objectType} from "nexus";
const jwt = require('jwt-then')

export const VCCSType = objectType({
    name: VCCS.$name,
    definition(t) {
        t.field(VCCS.id)
        t.field(VCCS.mFirstNode)
        t.field(VCCS.pFirstNode)
        t.field(VCCS.mSecondNode)
        t.field(VCCS.pSecondNode)
        t.field(VCCS.T1)
        t.field(VCCS.T2)
        t.field(VCCS.transmission)
    }
})
