/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addCCVS
// ====================================================


export interface addCCVS_addCCVS {
  __typename: "CCVS";
  id: number;
}

export interface addCCVS {
  /**
   * add CCVS or CCVS freq depended to schema
   */
  addCCVS: addCCVS_addCCVS | null;
}

export interface addCCVSVariables {
  schemaId: number;
  data: InputControlledSource;
}
