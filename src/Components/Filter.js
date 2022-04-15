import React from 'react';
import "../styles/filter.css";
import queryString from "query-string";
import Navbar from './Navbar';
import axios from 'axios';

class Filter extends React.Component{
    constructor(){
        super();
        this.state = {
            restaurants: [],
            locations: [],
            mealtype: undefined,
            location: undefined,
            cuisine: [],
            lcost: undefined,
            hcost: undefined,
            sort: 1,
            page: 1,
            pageCount: [],
            mealtypes_arr: []
        }
    }

    dropDown = () => {
        if (document.getElementById("filter").classList.contains("dropFilter")){
            document.getElementById("filter").classList.remove("dropFilter");
        }
        else {
            document.getElementById("filter").classList.add("dropFilter");
        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const {mealtype, location} = qs;

        const filterObj = {
            mealtype: Number(mealtype),
            location
        }

        axios({
            method: 'POST',
            url: 'http://localhost:4567/filter',
            headers: { 'Content-Type' : 'application/json'},
            data: filterObj
        })
            .then( response => {
                this.setState({ restaurants: response.data.Restaurant, mealtype, pageCount: response.data.pageCount});
            })
            .catch(error => console.log(error))

        axios({
            method: 'GET',
            url: 'http://localhost:4567/locations',
            headers: { 'Content-Type' : 'application/json'}
        })
            .then( response => {
                this.setState({ locations: response.data.locations});
            })
            .catch(error => console.log(error))
            
        axios({
            method: 'GET',
            url: 'http://localhost:4567/mealtypes',
            headers: { 'Content-Type' : 'application/json'}
        })
            .then( response => {
                this.setState({mealtypes_arr: response.data.MealTypes})
            })
            .catch(error => console.log(error))
    }

    handleSortChange = (sort) =>{
        const { mealtype, cuisine, location, lcost, hcost, page } = this.state;
        const filterObj = {
            mealtype: Number(mealtype),
            cuisine: cuisine.length === 0 ? undefined : cuisine,  
            location,
            lcost,
            hcost,
            sort, 
            page            
        };

        axios({
            method: 'POST',
            url: 'http://localhost:4567/filter',
            headers: { 'Content-Type' : 'application/json'},
            data: filterObj
        })
            .then( response => {
                this.setState({ restaurants: response.data.Restaurant, sort, pageCount: response.data.pageCount});
            })
            .catch(error => console.log(error))
    }

    handleCostChange = (lcost, hcost) =>{
        const { mealtype, cuisine, location, sort, page } = this.state;
        const filterObj = {
            mealtype: Number(mealtype),
            cuisine: cuisine.length === 0 ? undefined : cuisine, 
            location,
            lcost,
            hcost,
            sort, 
            page            
        };

        axios({
            method: 'POST',
            url: 'http://localhost:4567/filter',
            headers: { 'Content-Type' : 'application/json'},
            data: filterObj
        })
            .then( response => {
                this.setState({ restaurants: response.data.Restaurant, lcost, hcost, pageCount: response.data.pageCount});
            })
            .catch(error => console.log(error))
    }

    handleLocationChange = (event) =>{
        const location = event.target.value;
        const { mealtype, cuisine, lcost, hcost, sort, page } = this.state;
        const filterObj = {
            mealtype: Number(mealtype),
            cuisine: cuisine.length === 0 ? undefined : cuisine,
            location,
            lcost,
            hcost,
            sort, 
            page            
        };

        axios({
            method: 'POST',
            url: 'http://localhost:4567/filter',
            headers: { 'Content-Type' : 'application/json'},
            data: filterObj
        })
            .then( response => {
                this.setState({ restaurants: response.data.Restaurant, location, pageCount: response.data.pageCount});
            })
            .catch(error => console.log(error))
    }

    handleCuisineChange = (cusId) =>{
        const { mealtype, location, cuisine, lcost, hcost, sort, page } = this.state;

        const index = cuisine.indexOf(cusId);
        console.log(index);
        if (index >= 0){
            cuisine.splice(index, 1);
            console.log(cuisine);
        }
        else{
            cuisine.push(cusId);
            console.log(cuisine);
        }

        const filterObj = {
            mealtype: Number(mealtype),
            cuisine: cuisine.length === 0 ? undefined : cuisine, 
            location,
            lcost,
            hcost,
            sort, 
            page            
        };

        axios({
            method: 'POST',
            url: 'http://localhost:4567/filter',
            headers: { 'Content-Type' : 'application/json'},
            data: filterObj
        })
            .then( response => {
                this.setState({ restaurants: response.data.Restaurant, cuisine, pageCount: response.data.pageCount});
            })
            .catch(error => console.log(error))
    }

    handleNavToDetails = (id) =>{
        this.props.history.push(`/details?restaurant=${id}`);
        // sessionStorage.setItem('restaurant_id', id);
    }

    handlePageChange = (pageNo) => {
        const page = pageNo;
        const { mealtype, location, cuisine, lcost, hcost, sort } = this.state;
        const filterObj = {
            mealtype: Number(mealtype),
            cuisine: cuisine.length === 0 ? undefined : cuisine, 
            location,
            lcost,
            hcost,
            sort, 
            page            
        };
        axios({
            method: 'POST',
            url: 'http://localhost:4567/filter',
            headers: { 'Content-Type' : 'application/json'},
            data: filterObj
        })
            .then( response => {
                this.setState({ restaurants: response.data.Restaurant, page, pageCount: response.data.pageCount});
            })
            .catch(error => console.log(error))
    }

    render(){
        const { restaurants, mealtypes_arr, mealtype, locations, pageCount } = this.state;
        return(
            <div>
                <Navbar />
                <div className="headingF">
                    <h1>{mealtypes_arr[mealtype-1]?.name} Places in {restaurants[0]?.city}</h1>
                </div>

                <div className="filter-main-sec">
                    <div className="Filter">
                        <h2>
                            Filters|Sort
                            <i class="iconArrowDown fas fa-solid fa-angle-down" onClick={this.dropDown}></i>
                        </h2>
                        <div className="Filter-drop" id="filter">
                            <div className="headings">Select Location</div>
                            <select id="Select" onChange={this.handleLocationChange}>
                                <option value="">Select</option>
                                {locations.map((item) => {
                                    return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                                })}
                            </select>
                            <div className="headings">Cuisine</div>
                            <div className="subs">
                                <label><input type="checkbox" className="sub-head" onChange={() => this.handleCuisineChange(1)}/>  North Indian</label>
                                <label><input type="checkbox" className="sub-head" onChange={() => this.handleCuisineChange(2)}/>  South Indian</label>
                                <label><input type="checkbox" className="sub-head" onChange={() => this.handleCuisineChange(3)}/>  Chinese</label>
                                <label><input type="checkbox" className="sub-head" onChange={() => this.handleCuisineChange(4)}/>  Fast Food</label>
                                <label><input type="checkbox" className="sub-head" onChange={() => this.handleCuisineChange(5)}/>  Street Food</label>
                            </div>
                            <div className="headings">Cost for two</div>
                            <div className="subs">
                                <label><input type="radio" className="sub-head" name="cost" onChange={() => this.handleCostChange(1, 500)}/>Less than ₹ 500</label>
                                <label><input type="radio" className="sub-head" name="cost" onChange={() => this.handleCostChange(500, 1000)}/>₹500 to ₹1000</label>
                                <label><input type="radio" className="sub-head" name="cost" onChange={() => this.handleCostChange(1000, 1500)}/>₹1000 to ₹1500</label>
                                <label><input type="radio" className="sub-head" name="cost" onChange={() => this.handleCostChange(1500, 2000)}/>₹1500 to ₹2000</label>
                                <label><input type="radio" className="sub-head" name="cost" onChange={() => this.handleCostChange(2000, 50000)}/>₹2000 +</label>
                            </div>
                            <div className="headings">Sort</div>
                            <div className="subs">
                                <label><input type="radio" className="sub-head" name="sorting" onChange={() => this.handleSortChange(1)}/>Price Low to High</label>
                                <label><input type="radio" className="sub-head" name="sorting" onChange={() => this.handleSortChange(-1)}/>Price High to Low</label>
                            </div>
                        </div>
                    </div>
                    <div className="resWrapper">
                        {restaurants.length > 0 ? restaurants.map(item => {
                            return <div className="item" onClick={() => this.handleNavToDetails(item._id)}>
                            <div className="above-line">
                                <div className="image">
                                    <img src={item.image} alt="" />
                                </div>
                                <div className="left-of-image">
                                    <div className="blockhead">{item.name}</div>
                                    <div className="fort">{item.locality}</div>
                                    <div className="address">{item.city}</div>
                                </div>
                            </div>
                            
                            <div className="line"></div>
                
                            <div className="below-line">
                                <div className="in-left">
                                    <div className="leftdata1">CUSINES : </div>
                                    <div className="leftdata2">COST FOR TWO : </div>
                                </div>
                                <div className="in-right">
                                    <div className="rightdata1">{item.cuisine[0].name}, {item.cuisine[1].name}</div>
                                    <div className="rightdata2">{item.min_price}</div>
                                </div>
                            </div>
                        </div>
                        }) : <div className="noRecords">No Records Found</div> }

                        {restaurants.length > 0 ? <div className="buttons">
                            <button className="bt">&lt;</button>
                            {pageCount.map(pageNo =>{
                                return <button className="bt" onClick={() => this.handlePageChange(pageNo)}>{pageNo}</button>
                            })}
                            <button className="bt">&gt;</button>
                        </div> : null}
                    </div>                                      
                </div>
            </div>
        )
    }
}

export default Filter;