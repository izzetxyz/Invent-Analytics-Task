const User = require('../../models/userModel');


const createUser = async (req,res,next) => {
  try{
    const findUser = await User.findOne({name:req.body.name});
    if(!findUser){
      const newUser = new User(
        {
          name: req.body.name
        }
      );
      await newUser.save();
      res.status(200).send('User created successfully');;
    }
    else{
      res.status(500).json({ success: false, message: "User already saved" });
    }
  }
  catch (err){
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
const getUsers = async (req,res,next) => {
    try{
        const users = await User.find({}, '_id name');
        res.status(200).json(users);
    }
    catch (err){
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}
const getUser = async (req,res,next) => {
    try{
        const user = await User.findOne({_id: req.params.userId}, '_id name books');
        if(user){
            res.status(200).json(user);
        }
        else{
            res.status(500).json({ success: false, message: "User Not Found" });
        }
    }
    catch (err){
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}
module.exports = {
  createUser,
  getUsers,
  getUser
}