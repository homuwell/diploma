import {VCVS} from 'nexus-prisma'
import {extendType, inputObjectType, intArg, list, objectType} from "nexus";
const jwt = require('jwt-then')

export const VCVSType = objectType({
    name: VCVS.$name,
    definition(t) {
        t.field(VCVS.id)
        t.field(VCVS.mFirstNode)
        t.field(VCVS.pFirstNode)
        t.field(VCVS.mSecondNode)
        t.field(VCVS.pSecondNode)
        t.field(VCVS.transmission)
        t.field(VCVS.T1)
        t.field(VCVS.T2)
    }
})
