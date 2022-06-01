/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: change_FD_VCCS
// ====================================================


export interface change_FD_VCCS {
  /**
   * Change VCCS and VCCS freq depended elem
   */
  changeVCCS: string | null;
}

export interface change_FD_VCCSVariables {
  elemId: number;
  data: InputControlledSource;
}
