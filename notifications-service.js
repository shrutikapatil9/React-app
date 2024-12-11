export const NOTIF_WISHLIST_CHANGED = "notif_wishlist_changed";
var observers = {};
let instance = null;

class NotificationService {
    constructor(){
        if(!instance) {
            instance = this;
        }
        return instance;
        
    }
    postNotification = (notifName, data) => {
        let obs = observers[notifName];
        for(var x = 0; x<obs.length; x++){
            var obj = obs[x];
            obj.callBack(data);
        }
    }
    removeObserver = (observer, notifName) => {
        var obs = observers[notifName];
        
        if (obs) {
            for (var x = 0; x < obs.length; x++){
                if(observer === obs[x].observer){
                    obs.splice(x, 1);
                    observers[notifName] = obs;
                    break;
                }
            }
        }
    }
    
    addObserver = (notifName, observer, callBack) => {
        let obs = observers[notifName];
        if(!obs) {
            observers[notifName] = [];
            
        }
        let obj = {observer, callBack: callBack};
        observers[notifName].push(obj);
        
        
    }
}
export default NotificationService