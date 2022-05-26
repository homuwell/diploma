/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


// ====================================================
// GraphQL mutation operation: activateAccount
// ====================================================


export interface activateAccount_activateAccount {
  __typename: "User";
  login: string;
}

export interface activateAccount {
  activateAccount: activateAccount_activateAccount | null;
}

export interface activateAccountVariables {
  token: string;
}
