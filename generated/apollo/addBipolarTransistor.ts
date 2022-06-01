/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputBipolarTransistors } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addBipolarTransistor
// ====================================================


export interface addBipolarTransistor_addBipolarTransistor {
  __typename: "bipolarTransistor";
  id: number;
}

export interface addBipolarTransistor {
  /**
   * add bipolar transistor to schema
   */
  addBipolarTransistor: addBipolarTransistor_addBipolarTransistor | null;
}

export interface addBipolarTransistorVariables {
  schemaId: number;
  data: InputBipolarTransistors;
}
