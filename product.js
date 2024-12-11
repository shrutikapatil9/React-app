import React, {Component} from 'react';
import './product.css';
import DataService from '../services/data-service';
import NotificationService, {NOTIF_WISHLIST_CHANGED} from '../services/notifications-service';
let ds = new DataService();
let ns = new NotificationService();
class Product extends Component {
    
    constructor(props) {
        super(props);
        this.state = {onWishList: ds.itemOnWishList()};
        this.onButtonClicked = this.onButtonClicked.bind(this);
        this.onWishListChanged = this.onWishListChanged.bind(this);
        
    }
     componentDidMount(){
        ns.addObserver(NOTIF_WISHLIST_CHANGED, this, this.onWishListChanged);
    }
    componentWillUnmount (){
        ns.removeObserver(this, NOTIF_WISHLIST_CHANGED);
        
    }
    onWishListChanged(newWishList){
        this.setState({onWishList: ds.itemOnWishList(this.props.product)});
    }
    onButtonClicked = () => {
        if(this.state.onWishList){
            ds.removeWishListItem(this.props.product);
        } else {
        ds.addWishListItem(this.props.product);
    }}
    render(){
        
        var btnClass;
        if(this.state.onWishList) {
            btnClass = "btn btn-danger";
        } else {
            btnClass = "btn btn-primary";
        }
        
        return(
        <div className= "card product">
            <img className = "card-img-top" src= {this.props.product.imgUrl} alt = "Product"></img>
            <div className="card-block">
                <h4 className = "card-title">{this.props.product.title}</h4>
                <p className="card-text">Price: ${this.props.product.price}</p>
                <a href = "#" onClick={() => this.onButtonClicked()}  className = {btnClass}>
                    {this.state.onWishList ? "Remove From Wishlist" : "Add to Cart"}</a>
        </div>
        </div>
        );
        
    }
}
                    
export default Product;