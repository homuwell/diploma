/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


//==============================================================
// START Enums and Input Objects
//==============================================================


export enum FunctionType {
  LINEAR = "LINEAR",
  LOGARITHMIC = "LOGARITHMIC",
  SINGLE = "SINGLE",
}

export enum Role {
  ADMIN = "ADMIN",
  PREMIUMUSER = "PREMIUMUSER",
  USER = "USER",
}

export interface InputBipolarTransistors {
  Cc: number;
  Ce: number;
  Rb: number;
  Rc: number;
  Re: number;
  b: number;
  nb: number;
  nc: number;
  ne: number;
}

export interface InputCapacitorsType {
  capacity: number;
  mNode: number;
  pNode: number;
}

export interface InputControlledSource {
  T1?: number | null;
  T2?: number | null;
  mFirstNode: number;
  mSecondNode: number;
  pFirstNode: number;
  pSecondNode: number;
  transmission: number;
}

export interface InputIdealOperationAmplifiersType {
  mFirstNode: number;
  mSecondNode: number;
  pFirstNode: number;
  pSecondNode: number;
}

export interface InputIdealTransformersType {
  gain: number;
  mFirstNode: number;
  mSecondNode: number;
  pFirstNode: number;
  pSecondNode: number;
}

export interface InputInductorsType {
  induction: number;
  mNode: number;
  pNode: number;
}

export interface InputOperationAmplifiersType {
  fT: number;
  mFirstNode: number;
  mSecondNode: number;
  pFirstNode: number;
  pSecondNode: number;
  rIn: number;
  rOut: number;
  u: number;
}

export interface InputResistorsType {
  mNode: number;
  pNode: number;
  resistance: number;
}

export interface InputTransformers {
  L1: number;
  L2: number;
  M: number;
  R1: number;
  R2: number;
  mFirstNode: number;
  mSecondNode: number;
  pFirstNode: number;
  pSecondNode: number;
}

export interface InputUnipolarTransistors {
  Csi: number;
  Czi: number;
  Czs: number;
  Rc: number;
  S: number;
  ni: number;
  ns: number;
  nz: number;
}

//==============================================================
// END Enums and Input Objects
//==============================================================

