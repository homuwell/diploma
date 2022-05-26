import {User, Role} from "nexus-prisma";
import {asNexusMethod, objectType} from "nexus";
import { GraphQLUpload } from 'graphql-upload';
export const UserObject = objectType({
    name: User.$name,
    description: 'User type',
    definition(t) {
        t.field(User.id)
        t.field(User.login)
        t.field(User.name)
        t.field(User.surname)
        t.field(User.password)
        t.field(User.email)
        t.field(User.phoneNumber)
        t.field(User.refreshToken)
        t.field(User.role)
        t.field(User.picture);
        t.field('accessToken', {type: 'String'});
    },
});

export const Upload = asNexusMethod(GraphQLUpload!, "Upload");



