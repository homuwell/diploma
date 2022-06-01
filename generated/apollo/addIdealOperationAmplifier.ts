/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputIdealOperationAmplifiersType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addIdealOperationAmplifier
// ====================================================


export interface addIdealOperationAmplifier_addIdealOperationAmplifier {
  __typename: "idealOperationAmplifier";
  id: number;
}

export interface addIdealOperationAmplifier {
  /**
   * add ideal operation amplifier to Schema
   */
  addIdealOperationAmplifier: addIdealOperationAmplifier_addIdealOperationAmplifier | null;
}

export interface addIdealOperationAmplifierVariables {
  schemaId: number;
  data: InputIdealOperationAmplifiersType;
}
