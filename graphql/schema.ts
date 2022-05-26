import {makeSchema, queryType, objectType, enumType, mutationType, fieldAuthorizePlugin} from "nexus";

import path from 'path'
import * as types from './../src/index'


export const schema = makeSchema({
   types,
    outputs: {
        typegen: path.join(
            process.cwd(),
            'node_modules',
            '@types',
            'nexus-typegen',
            'index.d.ts'),
        schema: path.join(process.cwd(), 'generated', 'schema.graphql'),
    },
    contextType: {
        module: path.join(process.cwd(), 'graphql','contextType.ts'),
        export: "Context"
    },
    plugins: [
        fieldAuthorizePlugin()
    ]
});