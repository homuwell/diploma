import {News} from 'nexus-prisma'
import {extendType, inputObjectType, intArg, list, objectType} from "nexus";
const jwt = require('jwt-then')


export const ResistorObject = objectType({
    name: News.$name,
    definition(t) {
        t.field(News.id)
        t.field(News.title)
        t.field(News.image)
        t.field(News.authorName)
        t.field(News.description)
    },
});