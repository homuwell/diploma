/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


// ====================================================
// GraphQL query operation: getSchema
// ====================================================


export interface getSchema_getSchema_resistors {
  __typename: "Resistor";
  resistance: number;
  pNode: number;
  mNode: number;
}

export interface getSchema_getSchema_capacitors {
  __typename: "Capacitor";
  capacity: number;
  pNode: number;
  mNode: number;
}

export interface getSchema_getSchema_inductors {
  __typename: "Inductor";
  pNode: number;
  mNode: number;
  induction: number;
}

export interface getSchema_getSchema_VCCSs {
  __typename: "VCCS";
  pFirstNode: number;
  mFirstNode: number;
  pSecondNode: number;
  mSecondNode: number;
  transmission: number;
  T1: number;
  T2: number;
}

export interface getSchema_getSchema_VCVSs {
  __typename: "VCVS";
  pFirstNode: number;
  mFirstNode: number;
  pSecondNode: number;
  mSecondNode: number;
  transmission: number;
}

export interface getSchema_getSchema_idealTransformers {
  __typename: "idealTransformer";
  pFirstNode: number;
  mFirstNode: number;
  pSecondNode: number;
  mSecondNode: number;
  gain: number;
}

export interface getSchema_getSchema_operationAmplifiers {
  __typename: "operationAmplifier";
  pFirstNode: number;
  mFirstNode: number;
  pSecondNode: number;
  mSecondNode: number;
  rIn: number;
  rOut: number;
  u: number;
  fT: number;
}

export interface getSchema_getSchema {
  __typename: "Schema";
  nr: number;
  nv: number;
  nc: number;
  nl: number;
  nf: number;
  nju: number;
  nev: number;
  ntri: number;
  nou: number;
  resistors: (getSchema_getSchema_resistors | null)[] | null;
  capacitors: (getSchema_getSchema_capacitors | null)[] | null;
  inductors: (getSchema_getSchema_inductors | null)[] | null;
  VCCSs: (getSchema_getSchema_VCCSs | null)[] | null;
  VCVSs: (getSchema_getSchema_VCVSs | null)[] | null;
  idealTransformers: (getSchema_getSchema_idealTransformers | null)[] | null;
  operationAmplifiers: (getSchema_getSchema_operationAmplifiers | null)[] | null;
}

export interface getSchema {
  /**
   * get all schema data
   */
  getSchema: getSchema_getSchema | null;
}

export interface getSchemaVariables {
  id: number;
}
