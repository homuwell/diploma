import {unipolarTransistor} from "nexus-prisma";
import {inputObjectType, objectType} from "nexus";

export const unipolarTransistorType = objectType({
    name: unipolarTransistor.$name,
    definition(t) {
        t.field(unipolarTransistor.schemaId)
        t.field(unipolarTransistor.id)
        t.field(unipolarTransistor.nz)
        t.field(unipolarTransistor.ns)
        t.field(unipolarTransistor.ni)
        t.field(unipolarTransistor.Rc)
        t.field(unipolarTransistor.Czi)
        t.field(unipolarTransistor.Czs)
        t.field(unipolarTransistor.Csi)
        t.field(unipolarTransistor.S)
    }
})

export const InputUnipolarTransistors = inputObjectType({
    name: 'InputUnipolarTransistors',
    definition(t) {
        t.nonNull.int('nz')
        t.nonNull.int('ns')
        t.nonNull.int('ni')
        t.nonNull.float('Rc')
        t.nonNull.float('Czi')
        t.nonNull.float('Czs')
        t.nonNull.float('Csi')
        t.nonNull.float('S')
    }
})