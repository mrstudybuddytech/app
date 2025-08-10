import { uploadData } from "./dbconfing.js";
const baseID = localStorage.getItem("baseID");
const batchValue = {
                   baseID :"",
                   Name :"",
                   Fees :"0",
                   Validate:""
        };

function generateId() {
    return `sc${Math.random().toString(36).substr(2, 9)}`;
}


const el1 = document.getElementById("sumbitBatch");
if(el1){
    el1.addEventListener("click",ValidateBatchForm);
}

async function ValidateBatchForm()
{
    if(document.getElementById("batchName").value=="" || document.getElementById("batchFees").value==""||document.getElementById("batchDate").value=="")
    {
        alert("please fill required section");
    }
    else
    {
       sumbitBatch();   
    }
}

 function sumbitBatch()
    {
        batchValue.baseID = baseID;
        batchValue.Name = document.getElementById("batchName").value;
        batchValue.Fees = document.getElementById("batchFees").value;
        batchValue.Validate = document.getElementById("batchDate").value;
        uploadData("BatchList",generateId(),batchValue);
    }






