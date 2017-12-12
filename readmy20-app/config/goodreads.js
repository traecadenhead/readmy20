import {parseString} from 'react-native-xml2js';

const key = "70tcnAIcCelnGsg5zZgpQ";
const secret = "5KwCGMOnB4u2RFEq9RJ4WknEN3AkkKPbUhGpVqHuE";

export default class goodreads {

    static search = (query, field = "all") => {
        return new Promise(function(resolve, reject){
            let request = new XMLHttpRequest();
            request.onreadystatechange = e => {
                if (request.readyState !== 4) {
                    return;
                }                
                if (request.status === 200) {
                    parseString(request.responseText, function(err, result){
                        console.warn(result);
                        resolve([]);
                    });                    
                } else {
                    reject('error');
                }
            };
            
            request.open('GET', `https://www.goodreads.com/search/index.xml?key=${key}&search=${field}&q=${query}`);
            request.send();
        });
    }
}