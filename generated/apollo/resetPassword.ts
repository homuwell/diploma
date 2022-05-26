/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


// ====================================================
// GraphQL mutation operation: resetPassword
// ====================================================


export interface resetPassword_resetPassword {
  __typename: "User";
  login: string;
}

export interface resetPassword {
  /**
   * reset user password in database
   */
  resetPassword: resetPassword_resetPassword | null;
}

export interface resetPasswordVariables {
  id: number;
  password: string;
}
