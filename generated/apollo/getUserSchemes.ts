/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


// ====================================================
// GraphQL query operation: getUserSchemes
// ====================================================


export interface getUserSchemes_getUserSchemes {
  __typename: "Schema";
  id: number;
  name: string;
}

export interface getUserSchemes {
  /**
   * get all user schemes by user id
   */
  getUserSchemes: (getUserSchemes_getUserSchemes | null)[] | null;
}
