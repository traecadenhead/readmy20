const convert = require('xml-js');
const axios = require('axios');

const apiKey = "70tcnAIcCelnGsg5zZgpQ";

export default class goodreads {
    
    static get = (isbn) => {
        return new Promise(function(resolve, reject){
            const url = `https://www.goodreads.com/book/show.xml?key=${apiKey}&id=${isbn}`;
            //console.warn(url);
            axios.get(url).then(function(response){
                if (response != undefined && response != null && response.status === 200) {
                    try{
                        const jsonData = convert.xml2json(response.data, {compact: true, nativeType: true});
                        const json = JSON.parse(jsonData);
                        if(json.GoodreadsResponse.book != undefined && json.GoodreadsResponse.book != null){
                            const book = goodreads.convertDetail(json.GoodreadsResponse.book);
                            resolve(book);
                        }
                        else{
                            resolve(null);
                        }
                    }
                    catch(e){
                        console.error(e);
                    }
                } else {
                    reject(new Error("Error making request to Goodreads"));
                }
            }, function(err){
                reject(err);
            });
        });
    };

    static search = (query) => {
        return new Promise(function(resolve, reject){
            axios.get(`https://www.goodreads.com/search/index.xml?key=${apiKey}&q=${query}`).then(function(response){
                if (response != undefined && response != null && response.status === 200) {
                    const jsonData = convert.xml2json(response.data, {compact: true, nativeType: true});
                    let books = [];
                    const json = JSON.parse(jsonData);
                    try{                        
                        for(const j of json.GoodreadsResponse.search.results.work)
                        {
                            books.push(goodreads.convertResult(j));
                        }
                        resolve(books);
                    }
                    catch(e){
                        // just one result so not handled as an array
                        const j = json.GoodreadsResponse.search.results.work;
                        books.push(goodreads.convertResult(j));
                        resolve(books);
                    }
                } else {
                    reject(new Error("Error making request to Goodreads"));
                }
            }, function(err){
                reject(err);
            });            
        });
    };

    static convertDetail = (j) => {
        let author = "";
        try{
            author = j.authors.author.name._text;
        }
        catch(e){
            try{
                for (const a of j.authors.author){
                    if(author != ""){
                        author += ", ";
                    }
                    author += a.name._text
                }
            }catch(e){}
        }
        return {
            isbn: j.id._text,
            title: j.title._cdata != undefined && j.title._cdata != null && j.title._cdata != '' ? j.title._cdata : j.title._text,
            author,        
            publisher: j.publisher._text,
            year: j.publication_year._text != undefined && j.publication_year._text != null ? j.publication_year._text : j.work.original_publication_year._text,
            pages: j.num_pages._cdata != undefined && j.num_pages._cdata != null && j.num_pages._cdata != '' ? j.num_pages._cdata : j.num_pages._text,
            rating: j.average_rating._text,
            imageUrl: j.image_url._text,
            summary: j.description._cdata        
        };
    };

    static convertResult = (j) => {
        return {
            isbn: j.best_book.id._text,
            year: j.original_publication_year._text,
            title: j.best_book.title._text,
            author: j.best_book.author.name._text
        };
    };
}