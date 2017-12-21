'use strict';

const https = require('https');
const fs = require('fs');
const convert = require('xml-js');
const apiKey = "70tcnAIcCelnGsg5zZgpQ";

callAction(process.argv[2]);

function callAction(action){
    console.log(action);
    if(action == "get"){
        const bookID = process.argv[3];
        console.log(bookID);
        getBook(bookID);
    }
    else{
        const words = process.argv.slice(3);        
        let query = "";        
        words.forEach(function addWord(word){
            if(query != ""){
                query += " ";
            }
            query += word;
        });
        searchGoodreads(query);
    }
}

function searchGoodreads(query){
    const request = https.get(`https://www.goodreads.com/search/index.xml?key=${apiKey}&q=${query}`, response => {
        if(response.statusCode === 200){
            let body = "";
            // Read the data
            response.on('data', data => {
              body += data.toString();
            });

            response.on('end', () => {
              try {
                const jsonData = convert.xml2json(body, {compact: true, nativeType: true});
                let books = [];
                const json = JSON.parse(jsonData);
                for(const j of json.GoodreadsResponse.search.results.work)
                {
                    books.push(convertBook(j));
                }
                fs.writeFile('results.json', JSON.stringify(books), function(){
                    console.log("wrote data to file");
                });
              } catch (error) {
                console.error(error);
              }
            });
        }
        else{
            const message = `There was an error getting the data for ${query} (${https.STATUS_CODES[response.statusCode]})`;
            console.error(message);
        }
    
    });
}

function convertBook(j){
    return {
        isbn: j.best_book.id._text,
        year: j.original_publication_year._text,
        title: j.best_book.title._text,
        author: j.best_book.author.name._text
    };
}

function getBook(id){
    console.log("starting get");
    const request = https.get(`https://www.goodreads.com/book/show.xml?key=${apiKey}&id=${id}`, response => {
        if(response.statusCode === 200){
            let body = "";
            // Read the data
            response.on('data', data => {
              body += data.toString();
            });

            response.on('end', () => {
              try {
                const jsonData = convert.xml2json(body, {compact: true, nativeType: true});
                fs.writeFile('results.json', jsonData, function(){
                    const json = JSON.parse(jsonData);
                    const book = convertBookDetail(json.GoodreadsResponse.book);
                    console.log(book);
                });                
                
              } catch (error) {
                console.error(error);
              }
            });
        }
        else{
            const message = `There was an error getting the data for ${query} (${https.STATUS_CODES[response.statusCode]})`;
            console.error(message);
        }
    
    });
}

function convertBookDetail(j){
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
        title: j.title._cdata,
		author,        
        publisher: j.publisher._text,
		year: j.publication_year._text != undefined && j.publication_year._text != null ? j.publication_year._text : j.work.original_publication_year._text,
		pages: j.num_pages._cdata,
        rating: j.average_rating._text,
        imageUrl: j.image_url._text,
        summary:  j.description._cdata        
    };
};