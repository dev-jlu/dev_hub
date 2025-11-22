import type { DefaultOptions } from '@apollo/client';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const defaultOptions: DefaultOptions = {
    watchQuery: {
        //useQuery
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    },
    query: {
        // client.query
        fetchPolicy: 'cache-first'
    }
}

const httpLink = createHttpLink({
    uri: import.meta.env.VITE_API_URL,
    credentials: "include",
});

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
});