/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


// ====================================================
// GraphQL mutation operation: createUser
// ====================================================


export interface createUser_createUser {
  __typename: "User";
  refreshToken: string;
  accessToken: string | null;
}

export interface createUser {
  /**
   * create User
   */
  createUser: createUser_createUser | null;
}

export interface createUserVariables {
  login: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  password: string;
}
