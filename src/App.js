import {ApolloProvider} from "react-apollo";
import client from './client';
import {Query} from "react-apollo";
import {SEARCH_REPOSITORIES} from "./graqhql";

import React, {useState} from 'react';

const DEFAULT_STATE = {
    first: 5,
    after: null,
    last: null,
    before: null,
    query: "フロントエンドエンジニア"
};


function Title(prop) {
    const repositoryCount = prop.data.search.repositoryCount;
    const repositoryUnit = repositoryCount % 2 !== 1 ? 'Repositories' : 'Repository';
    const title = `Github search result ${repositoryCount} ${repositoryUnit}`;
    return <h2>{title}</h2>
}

function Items(prop) {
    return (
        <ul>
            {
                prop.edges.map((edge) => (
                        <li>
                            {console.log(edge.node.url)}
                            <a href={edge.node.url} key={edge.node.id} target="_brank">{edge.node.name}</a>
                        </li>
                    )
                )
            }
        </ul>
    );
}

function App() {
    const [state, setState] = useState(DEFAULT_STATE);

    const {first, after, last, before, query} = state;


    const handleChange = (event) => {
        setState({
                ...state,
                query: event.target.value
            }
        );
    };

    return (
        <div className="App">
            <header className="App-header">

                <ApolloProvider client={client}>
                    <form action="">
                        <input type="text" value={state.query} onChange={handleChange}/>
                    </form>

                    <Query
                        query={SEARCH_REPOSITORIES}
                        variables={{first, after, last, before, query}}
                    >
                        {
                            ({loading, error, data}) => {
                                if (loading) return 'Loading...';
                                if (error) return error.message;
                                return (
                                    <React.Fragment>
                                        <Title data={data}/>
                                        <Items edges={data.search.edges} />
                                    </React.Fragment>
                                );
                            }
                        }
                    </Query>
                </ApolloProvider>
            </header>
        </div>
    );
}

export default App;
