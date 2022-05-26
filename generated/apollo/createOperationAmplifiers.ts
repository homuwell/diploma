/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputOperationAmplifiersType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createOperationAmplifiers
// ====================================================


export interface createOperationAmplifiers_createOperationAmplifiers {
  __typename: "operationAmplifier";
  id: number;
}

export interface createOperationAmplifiers {
  /**
   * add Operation Amplifiers of schema to database
   */
  createOperationAmplifiers: createOperationAmplifiers_createOperationAmplifiers | null;
}

export interface createOperationAmplifiersVariables {
  schemaId: number;
  operationAmplifiers: InputOperationAmplifiersType[];
}
