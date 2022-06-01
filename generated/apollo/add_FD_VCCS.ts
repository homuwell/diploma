/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: add_FD_VCCS
// ====================================================


export interface add_FD_VCCS_addVCCS {
  __typename: "VCCS";
  id: number;
}

export interface add_FD_VCCS {
  /**
   * add VCCS or VCCS freq depended to schema
   */
  addVCCS: add_FD_VCCS_addVCCS | null;
}

export interface add_FD_VCCSVariables {
  schemaId: number;
  data: InputControlledSource;
}
