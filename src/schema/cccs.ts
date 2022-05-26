import {CCCS} from 'nexus-prisma'
import {objectType} from "nexus";

export const CCCSType = objectType({
    name: CCCS.$name,
    definition(t) {
        t.field(CCCS.id)
        t.field(CCCS.mFirstNode)
        t.field(CCCS.pFirstNode)
        t.field(CCCS.mSecondNode)
        t.field(CCCS.pSecondNode)
        t.field(CCCS.T1)
        t.field(CCCS.T2)
        t.field(CCCS.transmission)
    }
})