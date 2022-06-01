/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputIdealTransformersType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: changeIdealTransformer
// ====================================================


export interface changeIdealTransformer {
  /**
   * Change ideal transformer in Schema
   */
  changeIdealTransformer: string | null;
}

export interface changeIdealTransformerVariables {
  elemId: number;
  data: InputIdealTransformersType;
}
