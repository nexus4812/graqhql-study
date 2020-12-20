import {ApolloProvider} from "react-apollo";
import client from './client';

import gql from 'graphql-tag'
import {Query} from "react-apollo";

export const ME = gql`
  query me {
    user(login: "nexus4812") {
      name
      avatarUrl
    }
  }
`;

function App() {
  return (
    <div className="App">
      <header className="App-header">

          <ApolloProvider client={client}>
              <div>
                  hi
              </div>

              <Query query={ME}>
                  {
                      ({loading, error, data}) => {
                          if(loading) return 'Loading...';
                          if(error) return  error.message;

                          console.log(data.user);
                          return <img alt='avatarUrl' src={data.user.avatarUrl} />
                      }
                  }
              </Query>
          </ApolloProvider>
      </header>
    </div>
  );
}

export default App;
