import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import { Welcome } from "./welcome";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
import { init } from "./socket";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;

init(store);
if (location.pathname === "/") {
    elem = <Welcome />;
} else {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
