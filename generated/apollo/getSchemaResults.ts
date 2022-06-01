/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


// ====================================================
// GraphQL query operation: getSchemaResults
// ====================================================


export interface getSchemaResults_getSchemaResults {
  __typename: "SchemaResults";
  f: number;
  kum: number;
  kua: number;
  rim: number;
  ria: number;
  roa: number;
  rom: number;
}

export interface getSchemaResults {
  /**
   * get result of schema calculations
   */
  getSchemaResults: (getSchemaResults_getSchemaResults | null)[] | null;
}

export interface getSchemaResultsVariables {
  id: number;
}
