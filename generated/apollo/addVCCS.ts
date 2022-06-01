/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addVCCS
// ====================================================


export interface addVCCS_addVCCS {
  __typename: "VCCS";
  id: number;
}

export interface addVCCS {
  /**
   * add VCCS or VCCS freq depended to schema
   */
  addVCCS: addVCCS_addVCCS | null;
}

export interface addVCCSVariables {
  schemaId: number;
  data: InputControlledSource;
}
