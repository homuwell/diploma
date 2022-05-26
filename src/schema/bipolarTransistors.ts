import {bipolarTransistor} from "nexus-prisma";
import {inputObjectType, objectType} from "nexus";

export const bipolarTransistorType = objectType({
    name: bipolarTransistor.$name,
    definition(t) {
        t.field(bipolarTransistor.id)
        t.field(bipolarTransistor.ne)
        t.field(bipolarTransistor.nc)
        t.field(bipolarTransistor.nb)
        t.field(bipolarTransistor.Rb)
        t.field(bipolarTransistor.Re)
        t.field(bipolarTransistor.Rc)
        t.field(bipolarTransistor.Ce)
        t.field(bipolarTransistor.Cc)
        t.field(bipolarTransistor.b)
    }
})

export const InputBipolarTransistors = inputObjectType({
    name: 'InputBipolarTransistors',
    definition(t) {
        t.nonNull.int('ne')
        t.nonNull.int('nc')
        t.nonNull.int('nb')
        t.nonNull.float('Rb')
        t.nonNull.float('Re')
        t.nonNull.float('Rc')
        t.nonNull.float('Ce')
        t.nonNull.float('Cc')
        t.nonNull.float('b')
    }
})