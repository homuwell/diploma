/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputIdealTransformersType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addIdealTransformer
// ====================================================


export interface addIdealTransformer_addIdealTransformer {
  __typename: "idealTransformer";
  id: number;
}

export interface addIdealTransformer {
  /**
   * add ideal transformer to Schema
   */
  addIdealTransformer: addIdealTransformer_addIdealTransformer | null;
}

export interface addIdealTransformerVariables {
  schemaId: number;
  data: InputIdealTransformersType;
}
