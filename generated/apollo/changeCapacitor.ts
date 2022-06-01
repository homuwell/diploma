/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputCapacitorsType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: changeCapacitor
// ====================================================


export interface changeCapacitor {
  /**
   * Change capacitor in Schema
   */
  changeCapacitor: string | null;
}

export interface changeCapacitorVariables {
  elemId: number;
  data: InputCapacitorsType;
}
