/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputResistorsType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addResistor
// ====================================================


export interface addResistor_addResistor {
  __typename: "Resistor";
  id: number;
}

export interface addResistor {
  /**
   * add resistor i Schema
   */
  addResistor: addResistor_addResistor | null;
}

export interface addResistorVariables {
  schemaId: number;
  data: InputResistorsType;
}
