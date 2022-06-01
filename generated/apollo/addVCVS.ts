/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addVCVS
// ====================================================


export interface addVCVS_addVCVS {
  __typename: "VCVS";
  id: number;
}

export interface addVCVS {
  /**
   * add VCVS or VCVS freq depended to schema
   */
  addVCVS: addVCVS_addVCVS | null;
}

export interface addVCVSVariables {
  schemaId: number;
  data: InputControlledSource;
}
