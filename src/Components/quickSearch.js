import React from 'react';
import "../styles/home.css"
import QSItem from "./Qsearchitem";
import axios from 'axios';


class Qsearch extends React.Component{
    constructor(){
        super();
        this.state ={
            mealtypes: []
        }
    }

    componentDidMount(){
    axios({
        method: 'GET',
        url: 'https://obscure-stream-64864.herokuapp.com/mealtypes',
        headers: { 'Content-Type' : 'application/json'}
    })
        .then( response => {
            this.setState({mealtypes: response.data.MealTypes})
        })
        .catch(error => console.log(error))
    }
    

    render() {
        const { mealtypes } = this.state;
        return(
            <div>
                <div className="main-sec">
                    <div className="heading">Quick Searches</div>
                    <div className="sub-heading">Discover the restaurants by type or meal </div>
                    <div className="rows">
                        {mealtypes.map((item) => {
                            return <QSItem mealData = {item}/>
                        })}
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default Qsearch;