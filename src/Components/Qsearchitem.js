import React from "react";
import { withRouter } from "react-router-dom";

class QSItem extends React.Component{
    state = {
        show: "",
        hideHeading: "",
        showContent: ""
    }

    gotoFilter = (id) => {
        const locationId = sessionStorage.getItem('locationId');
        if (locationId){
            this.props.history.push(`/filter?mealtype=${id}&location=${locationId}`);
        }
        else{
            this.props.history.push(`/filter?mealtype=${id}`);
        }
        
    }  



    showState = () => this.setState({ show: " show",  showContent: " showContent", hideHeading: " hide"});
    dontShowState = () => this.setState({ show: "", hideHeading: "",  showContent: ""});
    
    render(){
        const {mealData} = this.props;
        return(
            <div>
                <div className="box" onClick={() => this.gotoFilter(mealData.meal_type)} onMouseEnter={this.showState} onMouseLeave={this.dontShowState}>
                    <div className="imgbox" >
                        <img className="boximg" src={mealData.image} alt="" />
                    </div>
                    <h1 className={`active${this.state.hideHeading}`} id="boxhover">{mealData.name}</h1>
                    <div className={`overlay${this.state.show}`} > </div>
                    <div className={`contentbox${this.state.showContent}`} >
                        <h2 >{mealData.name}</h2>
                        <p className="boxdesc">{mealData.content}</p>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default withRouter(QSItem);