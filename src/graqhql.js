import gql from 'graphql-tag'

export const ME = gql`
    query me {
        user(login: "nexus4812") {
            name
            avatarUrl
        }
    }
`;