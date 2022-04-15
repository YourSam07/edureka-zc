import React from 'react';
import "../styles/home.css"
import Hero from "./Hero";
import Qsearch from "./quickSearch";
import Navbar from './Navbar';
import axios from 'axios';


class Home extends React.Component{
    constructor(){
        super();
        this.state ={
            locations: []
        }
    }
    
    componentDidMount(){
        sessionStorage.clear();
        axios({
            method: 'GET',
            url: 'https://obscure-stream-64864.herokuapp.com/locations',
            headers: { 'Content-Type' : 'application/json'}
        })
            .then( response => {
                this.setState({ locations: response.data.locations});
            })
            .catch(error => console.log(error))           
    }

    render(){
        const { locations } = this.state;
        
        return(
            <div>
                <Navbar bgcolor="#ffffff00" opcOfLogo="0"/>
                <Hero locData={locations} />
                <Qsearch />
            </div>
        )
    }
}

export default Home;