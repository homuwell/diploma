/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: changeCCCS
// ====================================================


export interface changeCCCS {
  /**
   * Change CCCS and CCCS freq depended elem
   */
  changeCCCS: string | null;
}

export interface changeCCCSVariables {
  elemId: number;
  data: InputControlledSource;
}
