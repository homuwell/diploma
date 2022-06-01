/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputInductorsType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addInductor
// ====================================================


export interface addInductor_addInductor {
  __typename: "Inductor";
  id: number;
}

export interface addInductor {
  /**
   * add inductor to Schema
   */
  addInductor: addInductor_addInductor | null;
}

export interface addInductorVariables {
  schemaId: number;
  data: InputInductorsType;
}
