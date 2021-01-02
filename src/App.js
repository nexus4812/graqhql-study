import {ApolloProvider} from "react-apollo";
import client from './client';
import {Query, Mutation} from "react-apollo";
import {SEARCH_REPOSITORIES, ADD_STAR, REMOVE_STAR} from "./graqhql";

import React, {useState} from 'react';


const PER_PAGE = 15;

const DEFAULT_STATE = {
    first: PER_PAGE,
    after: null,
    last: null,
    before: null,
    query: "フロントエンドエンジニア"
};


function Title({repositoryCount}) {
    const repositoryUnit = repositoryCount !== 1 ? 'Repositories' : 'Repository';

    return <h2>{`Github search result ${repositoryCount} ${repositoryUnit}`}</h2>
}

function Items({edges}) {
    return (
        <ul>
            {edges.map(edge => <Item node={edge.node} key={edge.node.id}/>)}
        </ul>
    );
}

function Item({node}) {
    const {id, name, stargazers, url, viewerHasStarred} = node;
    const {totalCount} = stargazers;

    const StarStatus = ({addStar}) => (
        <button onClick={() => {
            addStar({variables: {input: {starrableId: id}}})
        }}> {totalCount} stars | {viewerHasStarred ? 'starred' : ' - '} </button>
    );

    return (
        <li>
            <a href={url} target="_brank">{name}</a>

            <Mutation mutation={viewerHasStarred ? REMOVE_STAR : ADD_STAR }>
                {
                    addStar => <StarStatus addStar={addStar}/>
                }
            </Mutation>
        </li>
    );
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
