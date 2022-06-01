/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: add_FD_CCVS
// ====================================================


export interface add_FD_CCVS_addCCVS {
  __typename: "CCVS";
  id: number;
}

export interface add_FD_CCVS {
  /**
   * add CCVS or CCVS freq depended to schema
   */
  addCCVS: add_FD_CCVS_addCCVS | null;
}

export interface add_FD_CCVSVariables {
  schemaId: number;
  data: InputControlledSource;
}
