import {CalculationDirectives, Capacitor} from 'nexus-prisma'
import {extendType, floatArg, intArg, list, objectType, stringArg} from "nexus";
import {AuthenticationError} from "apollo-server-micro";
const jwt = require('jwt-then')
import {CapacitorObject, InputCapacitorsType} from "./capacitors";

export const CalculationDirectivesObject = objectType({
    name: CalculationDirectives.$name,
    definition(t) {
        t.field(CalculationDirectives.id)
        t.field(CalculationDirectives.schemaId)
        t.field(CalculationDirectives.first)
        t.field(CalculationDirectives.second)
        t.field(CalculationDirectives.third)
        t.field(CalculationDirectives.inNodeM)
        t.field(CalculationDirectives.inNodeP)
        t.field(CalculationDirectives.outNodeP)
        t.field(CalculationDirectives.outNodeM)
        t.field(CalculationDirectives.functionType)
    },
});

