/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputIdealOperationAmplifiersType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createIdealOperationAmplifiers
// ====================================================


export interface createIdealOperationAmplifiers_createIdealOperationAmplifiers {
  __typename: "idealOperationAmplifier";
  id: number;
}

export interface createIdealOperationAmplifiers {
  /**
   * add Operation Amplifiers of schema to database
   */
  createIdealOperationAmplifiers: createIdealOperationAmplifiers_createIdealOperationAmplifiers | null;
}

export interface createIdealOperationAmplifiersVariables {
  schemaId: number;
  idealOperationAmplifiers: InputIdealOperationAmplifiersType[];
}
