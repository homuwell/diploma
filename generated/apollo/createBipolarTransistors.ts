/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputBipolarTransistors } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createBipolarTransistors
// ====================================================


export interface createBipolarTransistors_createBipolarTransistors {
  __typename: "bipolarTransistor";
  Rb: number;
}

export interface createBipolarTransistors {
  /**
   * add bipolar transistors to schema and database
   */
  createBipolarTransistors: createBipolarTransistors_createBipolarTransistors | null;
}

export interface createBipolarTransistorsVariables {
  schemaId: number;
  bipolarTransistors: InputBipolarTransistors[];
}
