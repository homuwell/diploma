/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: add_FD_VCVS
// ====================================================


export interface add_FD_VCVS_addVCVS {
  __typename: "VCVS";
  id: number;
}

export interface add_FD_VCVS {
  /**
   * add VCVS or VCVS freq depended to schema
   */
  addVCVS: add_FD_VCVS_addVCVS | null;
}

export interface add_FD_VCVSVariables {
  schemaId: number;
  data: InputControlledSource;
}
