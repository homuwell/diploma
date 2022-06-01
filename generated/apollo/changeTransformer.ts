/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputTransformers } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: changeTransformer
// ====================================================


export interface changeTransformer {
  /**
   * Change transformer in Schema
   */
  changeTransformer: string | null;
}

export interface changeTransformerVariables {
  elemId: number;
  data: InputTransformers;
}
