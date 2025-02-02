const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios= require("axios");
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop using axios

public_users.get("/", async (req, res) => {
    try {
        const data= axios.get('https://houssemeddi6-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/');
        res.status(200).json(books)
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
});

// Get book details based on ISBN using axios
public_users.get('/isbn/:isbn', function (req, res){
  let {isbn}= req.params;
  axios
  .get(`https://houssemeddi6-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/${isbn}`)
  .then( res.send(books[isbn])
  )
  .catch(function(error) {
      if(error.response){
          let {status , statustext} = error.response;
          res.status(status).send(statustext);
      } else {
    res.status(404).send(error);}
})
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
const author= req.params.author;
for (let i=1 ; i<11 ;i++){
    if (books[i].author===author) {
        res.send(books[i]);
    }
}

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title= req.params.title;
    for (let i=1 ; i<11 ;i++){
        if (books[i].title===title) {
            res.send(books[i]);
        }
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
