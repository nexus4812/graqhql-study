import {ApolloProvider} from "react-apollo";
import client from './client';
import {Query} from "react-apollo";
import {SEARCH_REPOSITORIES} from "./graqhql";

import React, { useState } from 'react';

const DEFAULT_STATE = {
    first: 5,
    after: null,
    last: null,
    before: null,
    query: "フロントエンドエンジニア"
};

function App() {
    const [state, setState] = useState(DEFAULT_STATE);

    const {first, after, last, before, query} = state;

    return (
        <div className="App">
            <header className="App-header">

                <ApolloProvider client={client}>
                    <div>
                        hi
                    </div>

                    <Query
                        query= {SEARCH_REPOSITORIES}
                        variables= {{first, after, last, before, query}}
                    >
                        {
                            ({loading, error, data}) => {
                                console.log(loading);

                                if (loading) return 'Loading...';
                                if (error) return error.message;


                                console.log(data);
                                return ''
                            }
                        }
                    </Query>
                </ApolloProvider>
            </header>
        </div>
    );
}

export default App;
