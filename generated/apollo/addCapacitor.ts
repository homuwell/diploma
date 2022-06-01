/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputCapacitorsType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addCapacitor
// ====================================================


export interface addCapacitor_addCapacitor {
  __typename: "Capacitor";
  id: number;
}

export interface addCapacitor {
  /**
   * add capacitor to Schema
   */
  addCapacitor: addCapacitor_addCapacitor | null;
}

export interface addCapacitorVariables {
  schemaId: number;
  data: InputCapacitorsType;
}
