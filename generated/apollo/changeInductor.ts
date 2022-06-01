/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputInductorsType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: changeInductor
// ====================================================


export interface changeInductor {
  /**
   * Change inductor in Schema
   */
  changeInductor: string | null;
}

export interface changeInductorVariables {
  elemId: number;
  data: InputInductorsType;
}
