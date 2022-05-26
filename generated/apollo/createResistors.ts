/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputResistorsType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createResistors
// ====================================================


export interface createResistors_createResistors {
  __typename: "Resistor";
  id: number;
}

export interface createResistors {
  /**
   * add resistors to schema and database
   */
  createResistors: createResistors_createResistors | null;
}

export interface createResistorsVariables {
  schemaId: number;
  resistors: InputResistorsType[];
}
