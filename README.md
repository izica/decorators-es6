# decorators-es6
Decorators for es6+, with promise support
### Install
```
npm install decorators-es6
```
```
yarn add decorators-es6
```

### Decorators 
* debounce
* memoize
* cache - alias for memoize
* throttle

### Features
* Easy to use as decorator in es6
* Promise support
* Decorated function return value in promise chain

### Warning
For use this package your app need to support these features(Babel or Polyfills):
* Promise
* arrow functions () => {}
* import, export

### Usage
#### debounce(time)
Default debounce time = 500ms
```javascript
import { debounce } from 'decorators-es6';

class Store {
    message = 'msg';

    @debounce(1000)
    changeMessage = (message) => {
        this.message = message;
        return 'updated';
    };

    @debounce(1000)
    updateOnServer = (message) => {
        return axios.post('/message/update', {message});
    }
}

const store = new Store();
store.changeMessage('msg2');

store.changeMessage('msg2').then(value => {
    //debounce firing;
    console.log(value) // 'updated'
});

store.updateOnServer('msg2').then(response => {
    //debounce firing;
    console.log(response) // axios response from server(Promise resolve)
});
```

#### memoize(time) or cache(time)
Default memoize time = 9999999ms
```javascript
import { memoize} from 'decorators-es6';

class Service {
    @memoize()
    calc = (number) => {
        return number * 5;
    };
    
    // memoize product info for 100 secs
    @memoize(100000) 
    getProductFromServer = (productId) => {
        return axios.post('/product', {productId});
    }
}

const service = new Service();
service.calc(10).then(result => {
    console.log(result);
})

service.getProductFromServer().then(response => {
    console.log(response); // response from axios for example
    store.product = response.data.product;
})
```

#### throtle(time)
Default debounce time = 500ms
Example: see debounce example