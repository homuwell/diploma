/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


// ====================================================
// GraphQL query operation: getUserData
// ====================================================


export interface getUserData_getUserData {
  __typename: "User";
  id: number;
  login: string;
  picture: string;
}

export interface getUserData {
  /**
   * Get user data
   */
  getUserData: getUserData_getUserData | null;
}
