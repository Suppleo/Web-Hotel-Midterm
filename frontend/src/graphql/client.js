import { ApolloClient, InMemoryCache, from } from '@apollo/client'; // Removed createHttpLink
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
// Explicitly import from the module file to help Vite resolve it
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

// Log any GraphQL errors or network errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

// Use createUploadLink instead of createHttpLink for file uploads
const uploadLink = createUploadLink({
  uri: import.meta.env.VITE_BACKEND_URL, // Same URI
  credentials: 'include', // Keep credentials setting if needed
  headers: { // Add this header for apollo-upload-client
    "Apollo-Require-Preflight": "true"
  }
});

// Add authentication headers
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: from([errorLink, authLink, uploadLink]), // Use uploadLink here
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default client;
