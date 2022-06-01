/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputOperationAmplifiersType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addOperationAmplifier
// ====================================================


export interface addOperationAmplifier_addOperationAmplifier {
  __typename: "operationAmplifier";
  id: number;
}

export interface addOperationAmplifier {
  /**
   * add operation amplifier to Schema
   */
  addOperationAmplifier: addOperationAmplifier_addOperationAmplifier | null;
}

export interface addOperationAmplifierVariables {
  schemaId: number;
  data: InputOperationAmplifiersType;
}
