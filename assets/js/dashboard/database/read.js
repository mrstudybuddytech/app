  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
  import { getFirestore,collection,getDocs,getDoc,doc,where,query,deleteDoc } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

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
 async function readBatch() {
        preLoader(true);
        let batchHtml = "";
         $.get("../dashboard/batchlist.html", function(data) {
               batchHtml = data;
            });
        const citiesRef = collection(db, "BatchList");
         const q = query(citiesRef, where("baseID", "==", baseID));
        //const collectionRef = collection(db, "BatchList");
        const querySnapshot = await getDocs(q);
        if(!querySnapshot.empty){
         document.getElementById("noData").remove();
        querySnapshot.forEach((doc) => {
           let addHtml= batchHtml.replace("{{BatchName}}",doc.data().Name)
            .replace("{{fees}}",doc.data().Fees)
            .replace("{{BatchDate}}",doc.data().Validate)
            .replace("{{ID}}",doc.id)
            .replace("{{ID}}",doc.id)
            .replace("{{collection}}","BatchList")
            $("#batchListBody").append($(addHtml));
            preLoader(false);
            
        });
      }
      else
      {
        preLoader(false);
      }
       InitBatch();
      }
const el1 = document.getElementById("batchListBody");
if(el1)
 {
  el1.addEventListener("DOMContentLoaded",readBatch());
 }


async function readStudent() {
        preLoader(true);
        let batchHtml = "";
         $.get("../dashboard/studentModal.html", function(data) {
               batchHtml = data;
            });
        const citiesRef = collection(db, "studentList");
        const q = query(citiesRef, where("baseID", "==", baseID));
        const querySnapshot = await getDocs(q);
        if(!querySnapshot.empty){
        document.getElementById("noData").remove();
        querySnapshot.forEach((doc) => {
           let addHtml= batchHtml.replace("{{Name}}",doc.data().Name)
            .replace("{{MB}}",doc.data().MobileNumber)
            .replace("{{Date}}",doc.data().DOR)
            .replace("{{studentID}}",doc.id)
            .replace("{{imageUrl}}",doc.data().imageUrl);
            $("#bodyListStudent").append($(addHtml));
            preLoader(false);
            
        });
      }
      else
      {
        preLoader(false);
      }
     
}
const el3 = document.getElementById("bodyListStudent");
if(el3)
 {
   el3.addEventListener("DOMContentLoaded",readStudent());
 }


 


function preLoader(action)
   {
        if(action==true)
          $("#preLoader").css("display","flex");
        else
          $("#preLoader").css("display","none");
   }

function InitBatch(){ 
    $(".Delete").click(function(){
       callDetete( "JYPL6341C",$(this).data('collection'),$(this).data('id'));
       
    });
    $(".batchOpen").click(function(){
      openRoom($(this).data('id'));
  });
}
function callDetete(baseID,collectionName,id) {
    if (confirm("Do you want to delete") == true) {
            preLoader(true);
            getDelete(["studentList",collectionName],baseID,id);
            //deleteDeta("BatchList",id);
        }
}

async function getDelete(collectionName, baseID, parentClassID) {
  if (!baseID || !parentClassID) {
    alert("Missing baseID or parentClassID");
    return;
  }

  for (let i = 0; i < collectionName.length; i++) {
    const Ref = collection(db, collectionName[i]);
    
    if (collectionName[i] === "studentList") {
      const q = query(
        Ref,
        where("baseID", "==", baseID),
        where("parentClassID", "==", parentClassID)
      );
      const querySnapshot = await getDocs(q);

      console.log(`Found ${querySnapshot.size} documents in studentList`);

      if (!querySnapshot.empty) {
        const deletePromises = querySnapshot.docs.map((docSnap) =>
          deleteDeta(collectionName[i], docSnap.id)
        );
        await Promise.all(deletePromises);
      }

    } else if (collectionName[i] === "BatchList") {
      console.log(`Deleting batch with ID: ${parentClassID}`);
      await deleteDeta(collectionName[i], parentClassID);
    }
  }

  alert("Successfully deleted!");
  preLoader(false);
  window.location.reload();
}
async function deleteDeta(collectionName, id) {
  try {
    console.log(`Deleting document from ${collectionName} with ID ${id}`);
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (e) {
    console.error("Error removing document:", e);
    alert("Error removing document: " + e.message);
    preLoader(false);
  }
}
 function openRoom(id)
{
   $("#MainBodyContainer").empty();
    $.get("../dashboard/classroom.html", function(data) {
          $("#MainBodyContainer").append(data.replace("{{baseID}}",id).replace("{{baseID}}",id));
      });
}



 async function  getBatchName(id)
 {
    const docRef = doc(db,"BatchList",id);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists())
    {
      return docSnap.data().Name;
    }
 }
function getfileData(fileName)
{
    $.get(fileName, function(data) {
        $("#MainBodyContainer").html(data); 
    });
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

