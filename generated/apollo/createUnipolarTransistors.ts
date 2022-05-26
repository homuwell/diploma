/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputUnipolarTransistors } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createUnipolarTransistors
// ====================================================


export interface createUnipolarTransistors_createUnipolarTransistors {
  __typename: "unipolarTransistor";
  id: number;
}

export interface createUnipolarTransistors {
  /**
   * add bipolar transistors to schema and database
   */
  createUnipolarTransistors: createUnipolarTransistors_createUnipolarTransistors | null;
}

export interface createUnipolarTransistorsVariables {
  schemaId: number;
  unipolarTransistors: InputUnipolarTransistors[];
}
