/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


// ====================================================
// GraphQL mutation operation: resetPasswordLink
// ====================================================


export interface resetPasswordLink_resetPasswordLink {
  __typename: "User";
  email: string;
}

export interface resetPasswordLink {
  /**
   * Send to user email link to reset password
   */
  resetPasswordLink: resetPasswordLink_resetPasswordLink | null;
}

export interface resetPasswordLinkVariables {
  email: string;
}
