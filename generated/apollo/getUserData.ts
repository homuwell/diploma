/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { Role } from "./globalTypes";

// ====================================================
// GraphQL query operation: getUserData
// ====================================================


export interface getUserData_getUserData {
  __typename: "User";
  login: string;
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  role: Role;
}

export interface getUserData {
  /**
   * Get user data
   */
  getUserData: getUserData_getUserData | null;
}
