/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: add_FD_CCCS
// ====================================================


export interface add_FD_CCCS_addCCCS {
  __typename: "CCCS";
  id: number;
}

export interface add_FD_CCCS {
  /**
   * add CCCS or CCCS freq depended to schema
   */
  addCCCS: add_FD_CCCS_addCCCS | null;
}

export interface add_FD_CCCSVariables {
  schemaId: number;
  data: InputControlledSource;
}
