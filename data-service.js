import NotificationService, {NOTIF_WISHLIST_CHANGED} from './notifications-service';
let ns = new NotificationService();
let instance = null;
var wishList = [];


class DataService {
    constructor(){
        if(! instance){
            instance = this;
            
        }
        return instance;
    }
    
    itemOnWishList = item => {
        for(var x = 0; x<wishList.length; x++){
            if (wishList[x]._id === item._id) {
                return true;
            }
        }
        return false;
    }
    addWishListItem = item => {
        wishList.push(item);
        ns.postNotification(NOTIF_WISHLIST_CHANGED, wishList);
        
    }
    removeWishListItem = item => {
        for (var x =0; x< wishList.length; x++) {
            if(wishList[x]._id === item._id){
                wishList.splice(x, 1);
                 ns.postNotification(NOTIF_WISHLIST_CHANGED, wishList);
                break;
            }
        }
        
    }
}
export default DataService;