/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputIdealTransformersType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createIdealTransformers
// ====================================================


export interface createIdealTransformers_createIdealTransformers {
  __typename: "idealTransformer";
  id: number;
}

export interface createIdealTransformers {
  /**
   * add ideal transformers to schema and database
   */
  createIdealTransformers: createIdealTransformers_createIdealTransformers | null;
}

export interface createIdealTransformersVariables {
  schemaId: number;
  idealTransformers: InputIdealTransformersType[];
}
