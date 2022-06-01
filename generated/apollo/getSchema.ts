/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


import { FunctionType } from "./globalTypes";

// ====================================================
// GraphQL query operation: getSchema
// ====================================================


export interface getSchema_getSchema_resistors {
  __typename: "Resistor";
  id: number;
  resistance: number;
  pNode: number;
  mNode: number;
}

export interface getSchema_getSchema_capacitors {
  __typename: "Capacitor";
  id: number;
  capacity: number;
  pNode: number;
  mNode: number;
}

export interface getSchema_getSchema_inductors {
  __typename: "Inductor";
  id: number;
  pNode: number;
  mNode: number;
  induction: number;
}

export interface getSchema_getSchema_VCCSs {
  __typename: "VCCS";
  id: number;
  pFirstNode: number;
  mFirstNode: number;
  pSecondNode: number;
  mSecondNode: number;
  transmission: number;
}

export interface getSchema_getSchema_VCCSsFreqDependent {
  __typename: "VCCS";
  id: number;
  pFirstNode: number;
  mFirstNode: number;
  pSecondNode: number;
  mSecondNode: number;
  transmission: number;
  T1: number;
  T2: number;
}

export interface getSchema_getSchema_CCCSs {
  __typename: "CCCS";
  id: number;
  pFirstNode: number;
  mFirstNode: number;
  pSecondNode: number;
  mSecondNode: number;
  transmission: number;
}

export interface getSchema_getSchema_CCCSsFreqDependent {
  __typename: "CCCS";
  id: number;
  pFirstNode: number;
  mFirstNode: number;
  pSecondNode: number;
  mSecondNode: number;
  transmission: number;
  T1: number;
  T2: number;
}

export interface getSchema_getSchema_CCVSs {
  __typename: "CCVS";
  id: number;
  pFirstNode: number;
  mFirstNode: number;
  pSecondNode: number;
  mSecondNode: number;
  transmission: number;
}

export interface getSchema_getSchema_CCVSsFreqDependent {
  __typename: "CCVS";
  id: number;
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
  id: number;
  pFirstNode: number;
  mFirstNode: number;
  pSecondNode: number;
  mSecondNode: number;
  transmission: number;
}

export interface getSchema_getSchema_VCVSsFreqDependent {
  __typename: "VCVS";
  id: number;
  pFirstNode: number;
  mFirstNode: number;
  pSecondNode: number;
  mSecondNode: number;
  transmission: number;
  T1: number;
  T2: number;
}

export interface getSchema_getSchema_transformers {
  __typename: "transformer";
  id: number;
  pFirstNode: number;
  mFirstNode: number;
  pSecondNode: number;
  mSecondNode: number;
  L1: number;
  L2: number;
  R1: number;
  R2: number;
  M: number;
}

export interface getSchema_getSchema_idealTransformers {
  __typename: "idealTransformer";
  id: number;
  pFirstNode: number;
  mFirstNode: number;
  pSecondNode: number;
  mSecondNode: number;
  gain: number;
}

export interface getSchema_getSchema_operationAmplifiers {
  __typename: "operationAmplifier";
  id: number;
  pFirstNode: number;
  mFirstNode: number;
  pSecondNode: number;
  mSecondNode: number;
  rIn: number;
  rOut: number;
  u: number;
  fT: number;
}

export interface getSchema_getSchema_idealOperationAmplifiers {
  __typename: "idealOperationAmplifier";
  id: number;
  pFirstNode: number;
  mFirstNode: number;
  pSecondNode: number;
  mSecondNode: number;
}

export interface getSchema_getSchema_bipolarTransistors {
  __typename: "bipolarTransistor";
  id: number;
  ne: number;
  nc: number;
  nb: number;
  Rb: number;
  Re: number;
  Rc: number;
  Cc: number;
  b: number;
}

export interface getSchema_getSchema_unipolarTransistors {
  __typename: "unipolarTransistor";
  id: number;
  nz: number;
  ns: number;
  ni: number;
  Rc: number;
  Csi: number;
  Czs: number;
  S: number;
}

export interface getSchema_getSchema_calculationDirectives {
  __typename: "CalculationDirectives";
  inNodeM: number;
  inNodeP: number;
  outNodeM: number;
  outNodeP: number;
  first: number;
  second: number;
  third: number;
  functionType: FunctionType;
}

export interface getSchema_getSchema {
  __typename: "Schema";
  name: string;
  nr: number;
  nv: number;
  nc: number;
  nl: number;
  ntri: number;
  ntr: number;
  nou: number;
  noui: number;
  ntb: number;
  ntu: number;
  resistors: (getSchema_getSchema_resistors | null)[] | null;
  capacitors: (getSchema_getSchema_capacitors | null)[] | null;
  inductors: (getSchema_getSchema_inductors | null)[] | null;
  VCCSs: (getSchema_getSchema_VCCSs | null)[] | null;
  VCCSsFreqDependent: (getSchema_getSchema_VCCSsFreqDependent | null)[] | null;
  CCCSs: (getSchema_getSchema_CCCSs | null)[] | null;
  CCCSsFreqDependent: (getSchema_getSchema_CCCSsFreqDependent | null)[] | null;
  CCVSs: (getSchema_getSchema_CCVSs | null)[] | null;
  CCVSsFreqDependent: (getSchema_getSchema_CCVSsFreqDependent | null)[] | null;
  VCVSs: (getSchema_getSchema_VCVSs | null)[] | null;
  VCVSsFreqDependent: (getSchema_getSchema_VCVSsFreqDependent | null)[] | null;
  transformers: (getSchema_getSchema_transformers | null)[] | null;
  idealTransformers: (getSchema_getSchema_idealTransformers | null)[] | null;
  operationAmplifiers: (getSchema_getSchema_operationAmplifiers | null)[] | null;
  idealOperationAmplifiers: (getSchema_getSchema_idealOperationAmplifiers | null)[] | null;
  bipolarTransistors: (getSchema_getSchema_bipolarTransistors | null)[] | null;
  unipolarTransistors: (getSchema_getSchema_unipolarTransistors | null)[] | null;
  calculationDirectives: getSchema_getSchema_calculationDirectives | null;
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
