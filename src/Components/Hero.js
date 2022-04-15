import React from 'react';
import axios from 'axios';
import { withRouter } from "react-router-dom";


class Hero extends React.Component{
    constructor(){
        super();
        this.state = {
            restaurants : [],
            inputText : undefined,
            suggestions : []
        }
    }

    handleLocChange = (event) => {
        const locationId = event.target.value;
        sessionStorage.setItem('locationId', locationId);

        axios({
            method: 'GET',
            url: `http://localhost:4567/restaurants/${locationId}`,
            headers: { 'Content-Type' : 'application/json'}
        })
            .then( response => {
                this.setState({ restaurants: response.data.Restaurants, inputText: ''});
            })
            .catch(error => console.log(error))           
    }
    
    handleSearch = (event) => {
        const { restaurants } = this.state;
        const inputText = event.target.value;

        const suggestions = restaurants.filter(item => item.name.toLowerCase().includes(inputText.toLowerCase()));
        this.setState({ inputText, suggestions });
    }

    selectingRestaurant = (resObj) => {
        this.props.history.push(`/details?restaurant=${resObj._id}`);
    }

    showSuggestions = () => {
        const { suggestions, inputText } = this.state;
        if (suggestions.length == 0 && inputText == undefined) {
            return null;
        }
        if (suggestions.length > 0 && inputText == '') {
            return null;
        }
        if (suggestions.length == 0 && inputText) {
            return <ul >
                <li>No Search Results Found</li>
            </ul>
        }
        return (
            <ul >
                {
                    suggestions.map((item, index) => (<li key={index} onClick={() => this.selectingRestaurant(item)}>{`${item.name} -   ${item.locality},${item.city}`}</li>))
                }
            </ul>
        );
    }

    render() {
        const { locData, inputText } = this.props;
        return(
            <div>
                <div className="container">
                    <div className="center">
                        <div className="logo">e!</div>
                        <p>Find The Best Restaurants, Cafes & Bars</p>
                        <div className="input-fields">
                            <div className="grid-items"> 
                                <select className="drop-down" name="" id="" onChange={this.handleLocChange}>
                                    <option value="">Select</option>
                                    {locData.map((item) => {
                                        return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                                    })}
                                </select>
                            </div>
                            <div className="grid-items"> 
                                <input id="query" className="search-bar" type="text" value={inputText}
                                    placeholder="Please Enter Restaurant Name" onChange={this.handleSearch} />
                                {this.showSuggestions()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } 
}

export default withRouter(Hero);