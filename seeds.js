import mongoose from "mongoose";
import Airport from "./models/airport";
import Comment from "./models/comment";
 
const data = [
    {
        name: "Indianapolis International Airport (IND)", 
        image: "http://www.hok.com/uploads/2012/04/10/indy-airport01.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Boston Logan International Airport (BOS)", 
        image: "http://www.cosentini.com/images/projects/LoganInternationalAirportTerminalA/01.logan-international-airport-terminal-a.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Chicago O'Hare Interational Airport (ORD)", 
        image: "https://bondlinkcdn.com/1348/332648_325638934118100_138929028_o-cropped.UbHU6MXpex.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
];
 
function seedDB(){
   //Remove all airports
   Airport.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed airports!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few airports
            data.forEach(function(seed){
                Airport.create(seed, function(err, airport){
                    if(err){
                        console.log(err)
                    } 
                    else {
                        console.log("added an airport");
                        //create a comment
                        Comment.create(
                            {
                                text: "This airport is laaaaame.",
                                author: "Homer"
                            }, 
                            function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    airport.comments.push(comment);
                                    airport.save();
                                    console.log("Created new comment");
                                }
                            }
                        );
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
export default seedDB;