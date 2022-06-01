/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputControlledSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: changeCCVS
// ====================================================


export interface changeCCVS {
  /**
   * Change CCVS and CCVS freq depended elem
   */
  changeCCVS: string | null;
}

export interface changeCCVSVariables {
  elemId: number;
  data: InputControlledSource;
}
