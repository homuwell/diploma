/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


// ====================================================
// GraphQL mutation operation: createSchema
// ====================================================


export interface createSchema_createSchema {
  __typename: "Schema";
  id: number;
}

export interface createSchema {
  /**
   * add schema parameters to database
   */
  createSchema: createSchema_createSchema | null;
}

export interface createSchemaVariables {
  name: string;
  nodes: number;
  resistors: number;
  capacitors: number;
  inductors: number;
  VCCSs: number;
  VCVSs: number;
  CCCSs: number;
  CCVSs: number;
  transformers: number;
  idealTransformers: number;
  operationAmplifiers: number;
  idealOperationAmplifiers: number;
  bipolarTransistors: number;
  unipolarTransistors: number;
}
