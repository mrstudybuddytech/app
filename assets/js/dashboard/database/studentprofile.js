 import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
  import { getFirestore, setDoc,doc,collection,query,getDocs,where,getCountFromServer} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

      // Your web app's Firebase configuration
      const firebaseConfig = {
        apiKey: "AIzaSyBY1z-ndNDL7QQTRXlOpAo2wYb3h9lL3-Y",
        authDomain: "studybuddy-cef26.firebaseapp.com",
        projectId: "studybuddy-cef26",
        storageBucket: "studybuddy-cef26.firebasestorage.app",
        messagingSenderId: "308381146703",
        appId: "1:308381146703:web:c76d1a9ce30e86ef2a543a",
        measurementId: "G-591CRH0FPT"
      };
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
const baseID = localStorage.getItem("baseID");
const studentModal = {
      baseID:"",
      parentClassID:"",
      Name : "",
      FatherName:"",
      MotherName:"",
      Gender :"",
      MobileNumber:"",
      DOB:"",
      imageUrl:"",
      className:"",
      address:"",
      whatsappNumber:"",
      DOR:""
};

if(document.getElementsByClassName("CompleteStudentDetails"))
{
    document.getElementsByClassName("CompleteStudentDetails")[0].addEventListener("click",function(){
       ValidateStudentForm1();
    });
}






async function ValidateStudentForm1()
{
    if(document.getElementById("SNAME").value =="" || document.getElementById("batchList").value=="Choose a Batch"|| document.getElementById("SFNAME").value ==""||
    document.getElementById("SMNAME").value ==""||
     document.getElementById("MB").value ==""||
     document.getElementById("gender").value == "Choose a Gender"||
    document.getElementById("WMB").value ==""||
    document.getElementById("address").value ==""||
     document.getElementById("imageData").value ==""||
    document.getElementById("DOB").value =="" ||
    document.getElementById("className").value == "Choose a class" )
     {
        alert("please fill required section");
    }
    else
    {
        sumbitStudentDetails();
    }
}

function sumbitStudentDetails()
{
    studentModal.baseID=baseID;
    studentModal.Name = document.getElementById("SNAME").value;
    studentModal.parentClassID = document.getElementById("batchList").value;
    studentModal.FatherName = document.getElementById("SFNAME").value;
    studentModal.MotherName = document.getElementById("SMNAME").value;
    studentModal.MobileNumber = document.getElementById("MB").value;
    studentModal.Gender = document.getElementById("gender").value;
    studentModal.whatsappNumber = document.getElementById("WMB").value;
    studentModal.address = document.getElementById("address").value;
    studentModal.imageUrl = document.getElementById("imageData").value;
    studentModal.DOB = document.getElementById("DOB").value;
    studentModal.className = document.getElementById("className").value; 
    studentModal.DOR = date();  
    profileUploadData("studentList",document.getElementById("SID").value,studentModal);
}



async function profileUploadData(collectionName, documentId, data) {
       if(getSize(baseID,data.className)==localStorage.getItem("students"))
       {
         alert("number of limit reached?")
         return;
       }
          preLoader(true);
          try {
            await setDoc(doc(db, collectionName, documentId), data);
            console.log("Document successfully written");
            alert("Document successfully written");
            window.location.href="../dashboard/index.html?id=SL";
          } catch (e) {
            console.error("Error writing document: ", e);
            alert("Error writing document: ", e);
            preLoader(false);
            window.location.reload();
          }
 }

 

  function preLoader(action)
   {
        if(action==true)
          $("#preLoader").css("display","flex");
        else
          $("#preLoader").css("display","none");
   }



   function date()
{
    let d = new Date();

    let day = String(d.getDate()).padStart(2, "0");

    let month = String(d.getMonth() + 1).padStart(2, "0");

    let year = d.getFullYear();

    let d1 = day + "/" + month + "/" + year;
    return d1;
}


const el2 = document.getElementById("batchList");
if(el2)
{
  el2.addEventListener("DOMContentLoaded",fetchList());
}

async function fetchList()
{
    const citiesRef = collection(db, "BatchList");
    const q = query(citiesRef, where("baseID", "==", baseID));
    //const collectionRef = collection(db, "BatchList");
    const querySnapshot = await getDocs(q);
   const html = '<option value="{{value}}">{{name}}</option>';
   querySnapshot.forEach((doc)=>{
           $("#batchList").append(html.replace("{{value}}",doc.id).replace("{{name}}",doc.data().Name));
   });
}

async function getSize(baseID,parentClassID)
   {
     const q = query(
                    collection(db, "studentList"),
                    where("baseID", "==", baseID),
                    where("parentClassID","==",parentClassID)
                    );
    const snapshot = await getCountFromServer(q);
    return  snapshot?snapshot.data().count:0;
   }



