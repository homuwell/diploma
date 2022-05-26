/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createCCCSs
// ====================================================


export interface createCCCSs_createCCCSs {
  __typename: "CCCS";
  id: number;
}

export interface createCCCSs {
  /**
   * add CCCSs to schema and database
   */
  createCCCSs: createCCCSs_createCCCSs | null;
}

export interface createCCCSsVariables {
  schemaId: number;
  CCCSs: InputControlledSource[];
}
