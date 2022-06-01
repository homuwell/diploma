/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { FunctionType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: changeFunction
// ====================================================


export interface changeFunction {
  /**
   * change function in calculation directives
   */
  changeFunction: string | null;
}

export interface changeFunctionVariables {
  schemaId: number;
  first: number;
  second: number;
  third: number;
  type: FunctionType;
}
