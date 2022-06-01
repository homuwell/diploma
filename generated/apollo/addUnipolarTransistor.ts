/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputUnipolarTransistors } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addUnipolarTransistor
// ====================================================


export interface addUnipolarTransistor_addUnipolarTransistor {
  __typename: "unipolarTransistor";
  id: number;
}

export interface addUnipolarTransistor {
  /**
   * add unipolar transistor to schema
   */
  addUnipolarTransistor: addUnipolarTransistor_addUnipolarTransistor | null;
}

export interface addUnipolarTransistorVariables {
  schemaId: number;
  data: InputUnipolarTransistors;
}
