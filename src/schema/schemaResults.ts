import {SchemaResults} from 'nexus-prisma'
import {objectType} from "nexus";

export const SchemaResultsObject = objectType({
    name: SchemaResults.$name,
    definition(t) {
        t.field(SchemaResults.id)
        t.field(SchemaResults.schemaId)
        t.field(SchemaResults.f)
        t.field(SchemaResults.kua)
        t.field(SchemaResults.kum)
        t.field(SchemaResults.roa)
        t.field(SchemaResults.rom)
        t.field(SchemaResults.ria)
        t.field(SchemaResults.rim)
    }
})
