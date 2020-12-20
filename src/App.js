import {ApolloProvider} from "react-apollo";
import client from './client';
import {Query} from "react-apollo";
import {ME} from "./graqhql";


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
                          console.log(loading);

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
