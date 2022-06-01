/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: change_FD_CCCS
// ====================================================


export interface change_FD_CCCS {
  /**
   * Change CCCS and CCCS freq depended elem
   */
  changeCCCS: string | null;
}

export interface change_FD_CCCSVariables {
  elemId: number;
  data: InputControlledSource;
}
