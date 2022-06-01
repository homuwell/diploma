/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: change_FD_CCVS
// ====================================================


export interface change_FD_CCVS {
  /**
   * Change CCVS and CCVS freq depended elem
   */
  changeCCVS: string | null;
}

export interface change_FD_CCVSVariables {
  elemId: number;
  data: InputControlledSource;
}
