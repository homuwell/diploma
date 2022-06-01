/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addCCCS
// ====================================================


export interface addCCCS_addCCCS {
  __typename: "CCCS";
  id: number;
}

export interface addCCCS {
  /**
   * add CCCS or CCCS freq depended to schema
   */
  addCCCS: addCCCS_addCCCS | null;
}

export interface addCCCSVariables {
  schemaId: number;
  data: InputControlledSource;
}
