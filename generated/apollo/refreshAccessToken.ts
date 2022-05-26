/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


// ====================================================
// GraphQL mutation operation: refreshAccessToken
// ====================================================


export interface refreshAccessToken_refreshAccessToken {
  __typename: "User";
  accessToken: string | null;
}

export interface refreshAccessToken {
  /**
   * refresh token
   */
  refreshAccessToken: refreshAccessToken_refreshAccessToken;
}

export interface refreshAccessTokenVariables {
  token?: string | null;
}
