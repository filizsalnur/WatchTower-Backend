const fs = require("fs");
const { response } = require("express");
const NFCData = require("../models/nfc_data");
const { json } = require("body-parser");
const { reset } = require("nodemon");
const User = require("../models/User");
const { Console } = require("console");
const Session=require("../models/session")
const tagOrder=require("../models/tagOrder");
const { TLSSocket } = require("tls");
function resetAllowedOrderArray() {
  const data = fs.readFileSync("./order.txt", "utf8");
  const parsedData = JSON.parse(data);
  allowedOrderArray = parsedData.allowedOrderArray || [];
  console.log("Allowed Order Array Reset:", allowedOrderArray);
}


const nfc_data_index = (req, res) => {
  NFCData.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { logs: result, title: "All NFC Data" });
    })
    .catch((err) => {
      console.log(err);
    });
};
 const nfc_data_details = (req, res) => { 
  const id = req.params.id;
  NFCData.findById(id) 
    .then((result) => {
      res.render("details", { nfc_data: result, title: "NFC Data Details" });
    })
    .catch((err) => {
      res.status(404).render("404", { title: "NFC Data not found" });
    });
};

const nfc_data_create_get = (req, res) => {
  res.render("create", { title: "Create a new NFC Data" });
}; 


const nfc_data_delete = (req, res) => {
  const id = req.params.id;
  //delete everything in the database
  NFCData.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/logs" });
    })
    .catch((err) => {
      console.log(err);
    });
};


const user_read_history=(req,res)=>{
  try{
  const id = req.body._id;
    console.log(id);
  NFCData.find({user_id:id})
 .then((result)=>{
  if(result.length==0 ){
    console.log("User not found");
    return res.status(404).json({message:'User not found'});
  }
  else{ 
  console.log(result);
  res.status(200).json(result);
  }
 })
}catch(err){
  res.statuscode(500).send('Unable to get user read history')
}
  
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 async function getUserSession(userId) {
  try {
    const userSession = await Session.findOne({ userId, isActive: true });

    return userSession;
  } catch (error) {
    console.error(error);
    return null;
  }
} 

async function checkTour(userId) {
  try {
    const userSession = await Session.findOne({ userId, isActive: true });

    for (const item of userSession.tagOrderIsread) {
      if (item.isRead === false) {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
}
 
const nfc_data_create_post = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const card_id = req.body.ID;

    const userSession = await getUserSession(user_id);

    if (!userSession) {
      console.log("User session not found or inactive");
      return res.status(404).json({ message: "User session not found or inactive" });
    }

    console.log("ORDER ARRAY FROM SESSION:", userSession.tagOrderIsread);

    const allowedOrderArray = userSession.tagOrderIsread;

    if (allowedOrderArray.length === 0) {
      console.log("Allowed order array is empty");
      return res.status(404).json({ message: "Allowed order array is empty" });
    }
    console.log("=============================================");
        
     let expectedItemID = '';

    for (const item of allowedOrderArray) {
       if (item.isRead === false) {
         
         expectedItemID = item.name;
        break;
      }
    }
 

    if (card_id === expectedItemID) {
   
      
        await NFCData.create(req.body);

        const updatedUserSession = userSession.tagOrderIsread.map((item) => {
          if (item.name === expectedItemID) {
            return { ...item, isRead: true };
          }
          return item;
        });

        userSession.tagOrderIsread = updatedUserSession;
        await userSession.save();
        if ( await checkTour(user_id)) {
          console.log("Tour completed");
          console.log("=============================================");
          const updatedUserSession = userSession.tagOrderIsread.map((item) => {
         
            return { ...item, isRead: false };
           
         });
  
        userSession.tagOrderIsread = updatedUserSession;
        await userSession.save();
       
         console.log("Tour completed");
          
          console.log("============================================= FINAL VERSION AFTER TOUR =================================");
          console.log( userSession.tagOrderIsread);
            return res.status(302).json({ message: "Tour Completed" });
         }
        else{
        res.status(200).json({ message: "Card read successfully" });
        }
   
    } else {
      console.log("Expected item ID:", expectedItemID);
      console.log("Received item ID:", card_id);
      res.status(400).json({ message: "Wrong tag scanned", expectedTagID: expectedItemID, receivedTagID: card_id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

 


 
 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////















function updateIsReadValue(fileName, nameToUpdate, newValue) {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    let jsonContent;
    try {
      jsonContent = JSON.parse(data);
     } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return;
    }

    const itemToUpdate = jsonContent.allowedOrderArray.find(item => item.name.toString() === nameToUpdate);
    if (itemToUpdate) {
      itemToUpdate.isRead = newValue;
      console.log(allowedOrderArray);
    } else {
      console.error(`Item with name ${nameToUpdate} not found`);
      return;
    }

    const updatedData = `{\n  "allowedOrderArray": ${JSON.stringify(jsonContent.allowedOrderArray, null, 2)}\n}\n`;

    fs.writeFile(fileName, updatedData, 'utf8', err => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('File updated successfully!');
      }
    });
  });
}
const resetRead=(req,res)=>{
  try{
resetIsReadValues("./order.txt");
res.status(200).send(
          "Read Order Reseted"
        );
  }
  catch(err){
    console.log(err);
    res.status(500).send('Unable to reset read order')
  }
}
function resetIsReadValues(fileName) {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    let jsonContent;
    try {
      jsonContent = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return;
    }

    jsonContent.allowedOrderArray.forEach(item => {
      item.isRead = false;
    });

    const updatedData = `{\n  "allowedOrderArray": ${JSON.stringify(jsonContent.allowedOrderArray, null, 2)}\n}\n`;

    fs.writeFile(fileName, updatedData, 'utf8', err => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('All isRead values reset successfully!');
      }
    });
  });
}

let allowedOrderArray = [];

   const data = fs.readFileSync("./order.txt", "utf8");
  const parsedData = JSON.parse(data);
  allowedOrderArray = parsedData.allowedOrderArray || [];
  console.log(allowedOrderArray);
 

let currentIndex = 0;
 



const reset_order = (req, res) => {
  try{
  currentIndex = 0;
  resetIsReadValues("./order.txt");
   res.status(200).send(
          "Read Order Reseted"
        );
   }catch(err){
    console.log(err);
    res.status(500).send('Unable to reset read order')
  }
 };
  


module.exports = {
  user_read_history,
  nfc_data_index,
  nfc_data_details,
  nfc_data_create_get,
  nfc_data_create_post,
  nfc_data_delete,
  reset_order,
  resetIsReadValues,
  resetAllowedOrderArray,
  resetRead

 };
 