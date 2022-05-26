/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


// ====================================================
// GraphQL mutation operation: resetPasswordAuth
// ====================================================


export interface resetPasswordAuth_resetPasswordAuth {
  __typename: "User";
  id: number;
}

export interface resetPasswordAuth {
  /**
   * Validate link and give user access to reset page
   */
  resetPasswordAuth: resetPasswordAuth_resetPasswordAuth | null;
}

export interface resetPasswordAuthVariables {
  token: string;
}
