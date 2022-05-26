/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createCCVSs
// ====================================================


export interface createCCVSs_createCCVSs {
  __typename: "CCVS";
  id: number;
}

export interface createCCVSs {
  /**
   * add CCVSs to schema and database
   */
  createCCVSs: createCCVSs_createCCVSs | null;
}

export interface createCCVSsVariables {
  schemaId: number;
  CCVSs: InputControlledSource[];
}
