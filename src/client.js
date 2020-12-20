import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const GITHUB_TOKEN = process.env.REACT_APP_GITHUBTOKEN;

const headersLink = new ApolloLink((operation, forward) => {
    operation.setContext({
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`
        }
    });
    return forward(operation)
});


const httpLink = new HttpLink({ uri: 'https://api.github.com/graphql' });

const link = ApolloLink.from([headersLink, httpLink]);

export default new ApolloClient({
    link,
    cache: new InMemoryCache()
})