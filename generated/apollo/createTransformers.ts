/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { InputTransformers } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createTransformers
// ====================================================


export interface createTransformers_createTransformers {
  __typename: "transformer";
  id: number;
}

export interface createTransformers {
  /**
   * add transformers to schema and database
   */
  createTransformers: createTransformers_createTransformers | null;
}

export interface createTransformersVariables {
  schemaId: number;
  transformers: InputTransformers[];
}
