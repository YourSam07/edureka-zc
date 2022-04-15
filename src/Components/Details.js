import React from 'react';
import queryString from 'query-string';
import axios from 'axios';
import '../styles/details.css';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Navbar from './Navbar';

Modal.defaultStyles.overlay.backgroundColor = '#0000008e';

// const customStyles = {
//     content: {
//         padding: '0',
//         top: '50%',
//         left: '50%',
//         right: 'auto',
//         bottom: 'auto',
//         marginRight: '-50%',
//         transform: 'translate(-50%, -50%)',
//         backgroundColor: 'white',
//         borderRadius: '15px',
//         width: '35rem'
//     },
// };

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},
            menuItems: [],
            menuItemsModalIsOpen: false,
            galleryModalIsOpen: false,
            formModalIsOpen: false,
            subTotal: 0,
            name: undefined,
            contactNumber: undefined,
            email: undefined,
            address: undefined
        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { restaurant } = qs;

        axios({
            method: 'GET',
            url: `https://obscure-stream-64864.herokuapp.com/restbyid/${restaurant}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ restaurant: response.data.Restaurant })
            })
            .catch()
    }

    handleOrder = (resId) => {
        axios({
            method: 'GET',
            url: `https://obscure-stream-64864.herokuapp.com/menuitems/${resId}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ menuItems: response.data.menuItems, menuItemsModalIsOpen: true })
            })
            .catch()
    }

    handleModal = (state, value) => {
        this.setState({ [state]: value })
    }

    handleInputChange = (state, event) => {
        this.setState({ [state]: event.target.value })
    }

    addItems = (index, operationType) => {
        let total = 0;
        // Spread Operator - Copy of Reference Types
        const items = [...this.state.menuItems];
        const item = items[index];

        if (operationType === 'add') {
            item.qty++;
        }
        else {
            item.qty--;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ menuItems: items, subTotal: total });
    }

    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })
        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = (data) => {
        return fetch(`https://obscure-stream-64864.herokuapp.com/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }

    handlePayment = (event) => {

        const { subTotal, email } = this.state;

        if (!email) {
            alert('Please fill this field and then Proceed...');
        }
        else {
            // Payment API Call 
            const paymentObj = {
                amount: subTotal,
                email: email
            };

            this.getData(paymentObj).then(response => {
                var information = {
                    action: "https://securegw-stage.paytm.in/order/process",
                    params: response
                }
                this.post(information)
            })
        }
        event.preventDefault();
    }

    render() {
        const { restaurant, menuItems, menuItemsModalIsOpen, galleryModalIsOpen, formModalIsOpen, subTotal } = this.state;
        return (
            <div>
                <Navbar />
                <div className='top_portion'>
                    <button className="gallery-button" onClick={() => this.handleModal('galleryModalIsOpen', true)}>Click to see Image Gallery</button>
                </div>

                <div className="sub-wrapper">
                    <div className="heading">{restaurant.name}</div>
                    <button className="btn-order" onClick={() => this.handleOrder(restaurant._id)}>Place Online Order</button>
                </div>

                <div className="tabs">
                    <div className="tab">
                        <input type="radio" id="tab-1" name="tab-group-1" checked />
                        <label for="tab-1">Overview</label>

                        <div className="content">
                            <div className="about">About this place</div>
                            <div className="head">Cuisine</div>
                            <div className="value">{restaurant && restaurant.cuisine && restaurant.cuisine.map((item) => { return `${item.name}, ` })} </div>
                            <div className="head">Average Cost</div>
                            <div className="value">&#8377; {restaurant.min_price} for two people(approx)</div>
                        </div>
                    </div>

                    <div className="tab">
                        <input type="radio" id="tab-2" name="tab-group-1" />
                        <label for="tab-2">Contact</label>

                        <div className="content">
                            <div className="head">Phone Number</div>
                            <div className="value">{restaurant.contact_number}</div>
                            <div className="head">Address</div>
                            <div className="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
                        </div>
                    </div>
                </div>
                
                <Modal 
                    isOpen={menuItemsModalIsOpen}
                    // style={customStyles}
                    className="Modal"
                    onRequestClose={() => this.handleModal('menuItemsModalIsOpen', false)}
                    shouldCloseOnOverlayClick={true}
                >
                    <div>
                        <i class="icon fas fa-times" onClick={() => this.handleModal('menuItemsModalIsOpen', false)}></i>    
                        
                        <h1 className="res-name">{restaurant.name}</h1>
                        
                        
                        <div className="modal-content" >                            
                            {menuItems.map((item, index) => {
                                return (
                                    <div className="card">
                                        <div className="desc">
                                            <h2 className="item-name">{item.name}</h2>
                                            <h4 className="item-price">&#8377;{item.price}</h4>
                                            <p className="item-descp">{item.description}</p> 
                                        </div>
                                        <div className="img-add-wrapper">
                                            <img className="card-img-tag" src={`../${item.image}`} />

                                            {item.qty === 0 ? <div className='add-button-div'>
                                                <button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button>
                                            </div> :
                                             <div className="add-number">
                                                <button className="add-Num-btn" onClick={() => this.addItems(index, 'subtract')}>-</button>
                                                <span class="qty">{item.qty}</span>
                                                <button className="add-Num-btn" onClick={() => this.addItems(index, 'add')}>+</button>
                                            </div>}

                                        </div>
                                        
                                    </div>

                                    
                                )
                            })}                        
                        </div>
                        
                        <div className="total-payNow-wrapper">
                                <h3 className="item-total">SubTotal : {subTotal}</h3>
                                <button className="order-button"
                                    onClick={() => {
                                        this.handleModal('menuItemsModalIsOpen', false);
                                        this.handleModal('formModalIsOpen', true);
                                    }}> Pay Now</button>
                        </div>

                    </div>
                </Modal>
                <Modal
                    isOpen={galleryModalIsOpen}
                    // style={CarouselStyle}
                    className="Modal"
                    onRequestClose={() => this.handleModal('galleryModalIsOpen', false)}
                    shouldCloseOnOverlayClick={true}
                >
                    <div className="cara-modal">
                        <i class="icon fas fa-times" onClick={() => this.handleModal('galleryModalIsOpen', false)}></i>
                        <Carousel
                            showThumbs={false}
                            showIndicators={false}>
                            {restaurant && restaurant.thumb && restaurant.thumb.map(item => {
                                return <div>
                                    <img src={`./${item}`} style={{ width: '100%', height: '100%' }} />
                                </div>
                            })}
                        </Carousel>
                    </div>
                </Modal>
                <Modal
                    isOpen={formModalIsOpen}
                    // style={customStyles}
                    className="Modal"
                    onRequestClose={() => this.handleModal('formModalIsOpen', false)}
                    shouldCloseOnOverlayClick={true}
                >
                    <div>
                        <i class="icon fas fa-times" onClick={() => this.handleModal('formModalIsOpen', false)}></i>

                        <h1 className="res-name">{restaurant.name}</h1>

                       
                        <form className="form">
                            <label className="form-head">Name</label>
                            <input type="text" className="form-control" onChange={(event) => this.handleInputChange('name', event)} />
                            <label className="form-head">Email</label>
                            <input type="text" className="form-control" onChange={(event) => this.handleInputChange('email', event)} />
                            <label className="form-head">Contact Number</label>
                            <input type="text" className="form-control" onChange={(event) => this.handleInputChange('contactNumber', event)} />
                            <label className="form-head">Address</label>
                            <input type="text" className="form-control" onChange={(event) => this.handleInputChange('address', event)} />
                            {/* <button class="btn btn-danger" style={{ marginTop: '20px', float: 'right' }} onClick={this.handlePayment}>Proceed</button> */}
                        </form>    
                        

                        <div className="proceed-wrapper">
                            <button className="proceed-btn" onClick={this.handlePayment}>Proceed</button>    
                        </div>    
                        
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Details;


