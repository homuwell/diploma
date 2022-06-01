/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { Role } from "./globalTypes";

// ====================================================
// GraphQL query operation: getUserDataProfile
// ====================================================


export interface getUserDataProfile_getUserData {
  __typename: "User";
  login: string;
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  role: Role;
  picture: string;
}

export interface getUserDataProfile {
  /**
   * Get user data
   */
  getUserData: getUserDataProfile_getUserData | null;
}
