/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createVCVSs
// ====================================================


export interface createVCVSs_createVCVSs {
  __typename: "VCVS";
  id: number;
}

export interface createVCVSs {
  /**
   * add VCVSs to schema and database
   */
  createVCVSs: createVCVSs_createVCVSs | null;
}

export interface createVCVSsVariables {
  schemaId: number;
  VCVSs: InputControlledSource[];
}
