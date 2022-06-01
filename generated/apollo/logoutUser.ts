/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


// ====================================================
// GraphQL mutation operation: logoutUser
// ====================================================


export interface logoutUser_logoutUser {
  __typename: "User";
  id: number;
}

export interface logoutUser {
  /**
   * logout user and remove cookies
   */
  logoutUser: logoutUser_logoutUser | null;
}
