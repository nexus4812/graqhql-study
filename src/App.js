import {ApolloProvider} from "react-apollo";
import client from './client';
import {Query} from "react-apollo";
import {SEARCH_REPOSITORIES} from "./graqhql";

import React, {useState} from 'react';


const PER_PAGE = 15;

const DEFAULT_STATE = {
    first: PER_PAGE,
    after: null,
    last: null,
    before: null,
    query: "フロントエンドエンジニア"
};


function Title(prop) {
    const repositoryCount = prop.repositoryCount;
    const repositoryUnit = repositoryCount % 2 !== 1 ? 'Repositories' : 'Repository';

    return <h2>{`Github search result ${repositoryCount} ${repositoryUnit}`}</h2>
}

function Items(prop) {
    const edges = prop.edges;
    return (
        <ul>
            {
                edges.map((edge) => (
                        <Item node={edge.node}/>
                    )
                )
            }
        </ul>
    );
}

function Item(prop)  {
    const {id, name, stargazers, url} = prop.node;

    return (
        <li key={id}>
            <a href={url} target="_brank">{name}</a><Star stargazers={stargazers} />
        </li>
    );
}

function Star(prop) {
    const {totalCount} = prop.stargazers;

    return (<button> {totalCount} stars </button>);
}

function Paginate(prop) {
    const state = prop.state;
    const setState = prop.setState;
    const {endCursor, hasNextPage, hasPreviousPage, startCursor} = prop.pageInfo;

    const nextClickHandle = () => setState({
        first: PER_PAGE,
        after: endCursor,
        last: null,
        before: null,
        query: state.query
    });

    const previousClickHandle = () => setState({
        first: null,
        after: null,
        last: PER_PAGE,
        before: startCursor,
        query: state.query
    });

    return (<>
            {
                hasPreviousPage ?
                    <button onClick={previousClickHandle}> Previous </button>
                    :
                    null
            }
            {
                hasNextPage ?
                    <button onClick={nextClickHandle}> Next </button>
                    :
                    null
            }
        </>
    );
}

function Contents(prop) {
    const {edges, pageInfo, repositoryCount} = prop.data.search;
    return (
        <>
            <Title repositoryCount={repositoryCount}/>
            <Items edges={edges}/>
            <Paginate pageInfo={pageInfo} state={prop.state} setState={prop.setState}/>
        </>
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
                                return (<Contents data={data} state={state} setState={setState}/>);
                            }
                        }
                    </Query>
                </ApolloProvider>
            </header>
        </div>
    );
}

export default App;
