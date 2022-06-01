/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputIdealOperationAmplifiersType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: changeIdealOperationAmplifier
// ====================================================


export interface changeIdealOperationAmplifier {
  /**
   * Change ideal operation amplifier in Schema
   */
  changeIdealOperationAmplifier: string | null;
}

export interface changeIdealOperationAmplifierVariables {
  elemId: number;
  data: InputIdealOperationAmplifiersType;
}
