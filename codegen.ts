import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: ['src/graphql/*.graphql','src/graphql/fragments/*.graphql'],
  generates: {
    'src/generated/generated.tsx': {
      // preset: 'client',
      plugins: ['typescript','typescript-operations','typescript-urql'],
      // presetConfig: {
      //   gqlTagName: 'gql',
      // }
    }
  },
  
};

export default config;