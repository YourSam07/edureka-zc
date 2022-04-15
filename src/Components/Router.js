import {BrowserRouter, Route } from 'react-router-dom';
import Home from "./Home";
import Filter from "./Filter";
import Details from "./Details";

function Router() {
    return (
        <BrowserRouter>
            <Route exact path="/" component={Home} />
            <Route path="/filter" component={Filter} />         
            <Route path="/details" component={Details} />         
        </BrowserRouter>
    )
}

export default Router;
