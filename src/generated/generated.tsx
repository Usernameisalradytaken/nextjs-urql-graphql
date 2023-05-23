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
  Logout: Scalars['Boolean'];
  Register: UserResponse;
  changePasswordByMail: UserResponse;
  createPost: Post;
  deletePost: Scalars['Boolean'];
  forgetPassword: Scalars['Boolean'];
  updatePassword: UserResponse;
  updatePost?: Maybe<Post>;
  vote: Scalars['Boolean'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationChangePasswordByMailArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationDeletePostArgs = {
  id: Scalars['Float'];
};


export type MutationForgetPasswordArgs = {
  email: Scalars['String'];
};


export type MutationUpdatePasswordArgs = {
  email: Scalars['String'];
  lastPassword: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  id: Scalars['Float'];
  title: Scalars['String'];
};


export type MutationVoteArgs = {
  postId: Scalars['Int'];
  value: Scalars['Int'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  hasMore: Scalars['Boolean'];
  posts: Array<Post>;
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['String'];
  creator: User;
  creatorId: Scalars['Float'];
  id: Scalars['Float'];
  points: Scalars['Float'];
  text: Scalars['String'];
  textSnippet: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
  voteStatus?: Maybe<Scalars['Int']>;
};

export type PostInput = {
  text: Scalars['String'];
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getPost?: Maybe<Post>;
  getPosts: PaginatedPosts;
  isLoggedIn: IsLoggedInResponse;
  me?: Maybe<User>;
};


export type QueryGetPostArgs = {
  id: Scalars['Int'];
};


export type QueryGetPostsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
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
  gender?: Maybe<Scalars['String']>;
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
  id?: Maybe<Scalars['Float']>;
  is: Scalars['Boolean'];
  username?: Maybe<Scalars['String']>;
};

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: number, updatedAt: string, createdAt: string, title: string, textSnippet: string, creatorId: number, points: number } };

export type ForgetPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgetPasswordMutation = { __typename?: 'Mutation', forgetPassword: boolean };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', Login: { __typename?: 'UserResponse', error?: { __typename?: 'ErrorReturn', status: number, message: string } | null, user?: { __typename?: 'User', id: number, email: string, username: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', Logout: boolean };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', Register: { __typename?: 'UserResponse', error?: { __typename?: 'ErrorReturn', status: number, message: string } | null, user?: { __typename?: 'User', id: number, email: string, username: string } | null } };

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  postId: Scalars['Int'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type ChangePasswordByMailMutationVariables = Exact<{
  newPassword: Scalars['String'];
  token: Scalars['String'];
}>;


export type ChangePasswordByMailMutation = { __typename?: 'Mutation', changePasswordByMail: { __typename?: 'UserResponse', error?: { __typename?: 'ErrorReturn', status: number, message: string } | null, user?: { __typename?: 'User', username: string, email: string, id: number } | null } };

export type PostSnippetFragment = { __typename?: 'Post', id: number, title: string, updatedAt: string, createdAt: string, textSnippet: string, points: number, voteStatus?: number | null, creator: { __typename?: 'User', username: string, email: string, gender?: string | null, id: number } };

export type RegularUserFragment = { __typename?: 'User', id: number, email: string, username: string };

export type GetPostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type GetPostsQuery = { __typename?: 'Query', getPosts: { __typename?: 'PaginatedPosts', hasMore: boolean, posts: Array<{ __typename?: 'Post', id: number, title: string, updatedAt: string, createdAt: string, textSnippet: string, points: number, voteStatus?: number | null, creator: { __typename?: 'User', username: string, email: string, gender?: string | null, id: number } }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string } | null };

export type IsLoggedInQueryVariables = Exact<{ [key: string]: never; }>;


export type IsLoggedInQuery = { __typename?: 'Query', isLoggedIn: { __typename?: 'isLoggedInResponse', isLogged?: { __typename?: 'isLoggedType', is: boolean, username?: string | null } | null, error?: { __typename?: 'ErrorReturn', status: number, message: string } | null } };

export const PostSnippetFragmentDoc = gql`
    fragment PostSnippet on Post {
  id
  title
  updatedAt
  createdAt
  title
  textSnippet
  points
  voteStatus
  creator {
    username
    email
    gender
    id
  }
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  email
  username
}
    `;
export const CreatePostDocument = gql`
    mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    id
    updatedAt
    createdAt
    title
    textSnippet
    creatorId
    points
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const ForgetPasswordDocument = gql`
    mutation ForgetPassword($email: String!) {
  forgetPassword(email: $email)
}
    `;

export function useForgetPasswordMutation() {
  return Urql.useMutation<ForgetPasswordMutation, ForgetPasswordMutationVariables>(ForgetPasswordDocument);
};
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
    mutation Logout {
  Logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
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
export const VoteDocument = gql`
    mutation vote($value: Int!, $postId: Int!) {
  vote(value: $value, postId: $postId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const ChangePasswordByMailDocument = gql`
    mutation changePasswordByMail($newPassword: String!, $token: String!) {
  changePasswordByMail(newPassword: $newPassword, token: $token) {
    error {
      status
      message
    }
    user {
      username
      email
      id
    }
  }
}
    `;

export function useChangePasswordByMailMutation() {
  return Urql.useMutation<ChangePasswordByMailMutation, ChangePasswordByMailMutationVariables>(ChangePasswordByMailDocument);
};
export const GetPostsDocument = gql`
    query GetPosts($limit: Int!, $cursor: String) {
  getPosts(limit: $limit, cursor: $cursor) {
    hasMore
    posts {
      ...PostSnippet
    }
  }
}
    ${PostSnippetFragmentDoc}`;

export function useGetPostsQuery(options: Omit<Urql.UseQueryArgs<GetPostsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetPostsQuery, GetPostsQueryVariables>({ query: GetPostsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    id
    username
  }
}
    `;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
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