/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: changeVCCS
// ====================================================


export interface changeVCCS {
  /**
   * Change VCCS and VCCS freq depended elem
   */
  changeVCCS: string | null;
}

export interface changeVCCSVariables {
  elemId: number;
  data: InputControlledSource;
}
