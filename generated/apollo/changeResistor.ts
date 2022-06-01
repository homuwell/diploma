/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputResistorsType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: changeResistor
// ====================================================


export interface changeResistor {
  /**
   * Change resistors in Schema
   */
  changeResistor: string | null;
}

export interface changeResistorVariables {
  elemId: number;
  data: InputResistorsType;
}
