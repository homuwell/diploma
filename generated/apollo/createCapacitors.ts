/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputCapacitorsType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createCapacitors
// ====================================================


export interface createCapacitors_createCapacitors {
  __typename: "Capacitor";
  id: number;
}

export interface createCapacitors {
  /**
   * add capacitors of schema to database
   */
  createCapacitors: createCapacitors_createCapacitors | null;
}

export interface createCapacitorsVariables {
  schemaId: number;
  capacitors: InputCapacitorsType[];
}
