/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { Role } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: authUser
// ====================================================


export interface authUser_authUser {
  __typename: "User";
  login: string;
  role: Role;
}

export interface authUser {
  /**
   * check user authenticated or not
   */
  authUser: authUser_authUser | null;
}
