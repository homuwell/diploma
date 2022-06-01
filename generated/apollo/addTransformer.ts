/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputTransformers } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addTransformer
// ====================================================


export interface addTransformer_addTransformer {
  __typename: "transformer";
  id: number;
}

export interface addTransformer {
  /**
   * add transformer to Schema
   */
  addTransformer: addTransformer_addTransformer | null;
}

export interface addTransformerVariables {
  schemaId: number;
  data: InputTransformers;
}
