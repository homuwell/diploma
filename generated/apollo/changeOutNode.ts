/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


// ====================================================
// GraphQL mutation operation: changeOutNode
// ====================================================


export interface changeOutNode_changeOutNode {
  __typename: "CalculationDirectives";
  id: number;
}

export interface changeOutNode {
  /**
   * change output node
   */
  changeOutNode: changeOutNode_changeOutNode | null;
}

export interface changeOutNodeVariables {
  schemaId: number;
  plus: number;
  minus: number;
}
