import {CCVS} from 'nexus-prisma'
import {objectType} from "nexus";

export const CCVSType = objectType({
    name: CCVS.$name,
    definition(t) {
        t.field(CCVS.id)
        t.field(CCVS.mFirstNode)
        t.field(CCVS.pFirstNode)
        t.field(CCVS.mSecondNode)
        t.field(CCVS.pSecondNode)
        t.field(CCVS.T1)
        t.field(CCVS.T2)
        t.field(CCVS.transmission)
    }
})