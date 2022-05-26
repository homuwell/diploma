/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createVCCSs
// ====================================================


export interface createVCCSs_createVCCSs {
  __typename: "VCCS";
  id: number;
}

export interface createVCCSs {
  /**
   * add VCCSs to database and schema
   */
  createVCCSs: createVCCSs_createVCCSs | null;
}

export interface createVCCSsVariables {
  schemaId: number;
  VCCSs: InputControlledSource[];
}
