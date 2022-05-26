/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


// ====================================================
// GraphQL mutation operation: loginUser
// ====================================================


export interface loginUser_loginUser {
  __typename: "User";
  refreshToken: string;
  accessToken: string | null;
}

export interface loginUser {
  /**
   * Mutation to authenticate user and send back tokens
   */
  loginUser: loginUser_loginUser | null;
}

export interface loginUserVariables {
  login: string;
  password: string;
}
