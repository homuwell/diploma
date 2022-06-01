/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: changeVCVS
// ====================================================


export interface changeVCVS {
  /**
   * Change VCVS and VCVS freq depended elem
   */
  changeVCVS: string | null;
}

export interface changeVCVSVariables {
  elemId: number;
  data: InputControlledSource;
}
