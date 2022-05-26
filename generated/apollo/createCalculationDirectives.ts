/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { FunctionType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createCalculationDirectives
// ====================================================


export interface createCalculationDirectives_createCalculationDirectives {
  __typename: "CalculationDirectives";
  id: number;
}

export interface createCalculationDirectives {
  /**
   * create Calculation Directives
   */
  createCalculationDirectives: createCalculationDirectives_createCalculationDirectives | null;
}

export interface createCalculationDirectivesVariables {
  schemaId: number;
  inM: number;
  inP: number;
  outP: number;
  outM: number;
  functionType: FunctionType;
  firstFuncElem: number;
  secondFuncElem: number;
  thirdFuncElem: number;
}
