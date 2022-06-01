/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: change_FD_VCVS
// ====================================================


export interface change_FD_VCVS {
  /**
   * Change VCVS and VCVS freq depended elem
   */
  changeVCVS: string | null;
}

export interface change_FD_VCVSVariables {
  elemId: number;
  data: InputControlledSource;
}
