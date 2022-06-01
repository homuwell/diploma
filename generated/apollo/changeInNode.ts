/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


// ====================================================
// GraphQL mutation operation: changeInNode
// ====================================================


export interface changeInNode_changeInNode {
  __typename: "CalculationDirectives";
  id: number;
}

export interface changeInNode {
  /**
   * change input node
   */
  changeInNode: changeInNode_changeInNode | null;
}

export interface changeInNodeVariables {
  schemaId: number;
  plus: number;
  minus: number;
}
