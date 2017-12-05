import mainCss from './main.less';

import Vue from 'Vue';
import carousel from 'component/carousel/index'

Vue.use(carousel);

let app = new Vue({
    el: '#app',
    data() {
        return {
            imgList: [
                require('image/1.jpg'),
                require('image/2.jpg'),
                require('image/3.jpg')
            ]
        }
    },
    methods: {
        yelp(index) {
            index++;
            alert("I'm the " + index + " lovely dog");
        },
        menu(index) {
            alert('this is menu ' + index);
        }
    }
});