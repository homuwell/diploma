/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.


// ====================================================
// GraphQL mutation operation: uploadUserPicture
// ====================================================


export interface uploadUserPicture_uploadUserPicture {
  __typename: "User";
  login: string;
}

export interface uploadUserPicture {
  /**
   * upload to server user picture and store its path in database
   */
  uploadUserPicture: uploadUserPicture_uploadUserPicture | null;
}

export interface uploadUserPictureVariables {
  picture: any;
}
