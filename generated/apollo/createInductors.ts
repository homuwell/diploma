/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputInductorsType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createInductors
// ====================================================


export interface createInductors_createInductors {
  __typename: "Inductor";
  id: number;
}

export interface createInductors {
  /**
   * add inductors to schema and database
   */
  createInductors: createInductors_createInductors | null;
}

export interface createInductorsVariables {
  schemaId: number;
  inductors: InputInductorsType[];
}
