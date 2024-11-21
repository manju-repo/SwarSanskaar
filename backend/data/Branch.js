
const Branch = require("../models/Branch");

const getBranches=async(req,res,next)=>{
    let students;
    try{
        branches=await Branch.find({},'-password');
        if (!branches) {
            throw new NotFoundError('Could not find any data.');
         }
        res.json({ branches: branches.map(branch => branch.toObject({ getters: true })) });
    }catch(err){
         console.log(err);
         return next(err);
    }
}

const getBranch=async(req,res,next)=>{
     if(! req.params) {
        const error= new Error("Could not fetch branch");
        return next(error);
     }
    let branch;
    try{
         branch=await Branch.findOne({_id:req.params.id});
         if (!branch) {
             throw new NotFoundError('Could not fetch branch');
          }
          console.log(branch.branch_name);
         res.json({ success:true, branch: branch.toObject({ getters: true }) });
    }catch(error){
         console.log(error);
         return next(error);
    }

}

const create=async(req,res,next)=>{
console.log("in create branch");

    const {branch_name, address}=req.body;
    console.log("from new branch", branch_name, address);
    const createdBranch=new Branch({branch_name, address});

    try{
        await createdBranch.save();
        console.log("Branch created");
        res.json({success:true, branch:createdBranch});
    }catch(err){
        console.log(err);
        res.json({success:false, branch:null, message:"Branch creation failed, please try again later."});
    }
}

async function update(req,res,next){
const {branch_name,address}=req.body;
const id=req.params.id;


  console.log("From update branch",id, branch_name, address);

   try{
        const updatedBranch=await Branch.findByIdAndUpdate(id,{branch_name:branch_name, address:address},
        { new: true });
        res.status(201).json({success:true, message:'branch updated', branch:updatedBranch});
    }
    catch(error){
        console.log(error.message);
        return next(error);
    }
}



    exports.getBranches=getBranches;
    exports.getBranch=getBranch;
    exports.update=update;
    exports.create=create;
