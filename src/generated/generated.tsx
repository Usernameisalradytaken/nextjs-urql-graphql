import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ErrorReturn = {
  __typename?: 'ErrorReturn';
  message: Scalars['String'];
  status: Scalars['Float'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  Login: UserResponse;
  Register: UserResponse;
  createPost: Post;
  deletePost: Scalars['Boolean'];
  updatePassword: UserResponse;
  updatePost?: Maybe<Post>;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationCreatePostArgs = {
  title: Scalars['String'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Float'];
};


export type MutationUpdatePasswordArgs = {
  id: Scalars['Float'];
  lastPassword: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  id: Scalars['Float'];
  title: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  Logout: Scalars['Boolean'];
  getPost?: Maybe<Post>;
  getPosts: Array<Post>;
  isLoggedIn: IsLoggedInResponse;
};


export type QueryGetPostArgs = {
  id: Scalars['Int'];
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Float'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  error?: Maybe<ErrorReturn>;
  user?: Maybe<User>;
};

export type IsLoggedInResponse = {
  __typename?: 'isLoggedInResponse';
  error?: Maybe<ErrorReturn>;
  isLogged?: Maybe<IsLoggedType>;
};

export type IsLoggedType = {
  __typename?: 'isLoggedType';
  is: Scalars['Boolean'];
  username?: Maybe<Scalars['String']>;
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', Login: { __typename?: 'UserResponse', error?: { __typename?: 'ErrorReturn', status: number, message: string } | null, user?: { __typename?: 'User', id: number, email: string, username: string } | null } };

export type LogoutQueryVariables = Exact<{ [key: string]: never; }>;


export type LogoutQuery = { __typename?: 'Query', Logout: boolean };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', Register: { __typename?: 'UserResponse', error?: { __typename?: 'ErrorReturn', status: number, message: string } | null, user?: { __typename?: 'User', id: number, email: string, username: string } | null } };

export type RegularUserFragment = { __typename?: 'User', id: number, email: string, username: string };

export type IsLoggedInQueryVariables = Exact<{ [key: string]: never; }>;


export type IsLoggedInQuery = { __typename?: 'Query', isLoggedIn: { __typename?: 'isLoggedInResponse', isLogged?: { __typename?: 'isLoggedType', is: boolean, username?: string | null } | null, error?: { __typename?: 'ErrorReturn', status: number, message: string } | null } };

export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  email
  username
}
    `;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  Login(input: $input) {
    error {
      status
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    query Logout {
  Logout
}
    `;

export function useLogoutQuery(options?: Omit<Urql.UseQueryArgs<LogoutQueryVariables>, 'query'>) {
  return Urql.useQuery<LogoutQuery, LogoutQueryVariables>({ query: LogoutDocument, ...options });
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!, $email: String!) {
  Register(input: {email: $email, username: $username, password: $password}) {
    error {
      status
      message
    }
    user {
      id
      email
      username
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const IsLoggedInDocument = gql`
    query isLoggedIn {
  isLoggedIn {
    isLogged {
      is
      username
    }
    error {
      status
      message
    }
  }
}
    `;

export function useIsLoggedInQuery(options?: Omit<Urql.UseQueryArgs<IsLoggedInQueryVariables>, 'query'>) {
  return Urql.useQuery<IsLoggedInQuery, IsLoggedInQueryVariables>({ query: IsLoggedInDocument, ...options });
};