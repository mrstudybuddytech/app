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
    const  db = getFirestore(app);
const baseID = localStorage.getItem("baseID");
async function readBatch() {
        preLoader(true);
        let batchHtml = "";
        $.get("../dashboard/atdmodal.html", function(data) {
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
            .replace("{{BatchDate}}",doc.data().Validate)
            .replace("{{BID}}",doc.id)
             .replace("{{BID}}",doc.id);
            $("#batchListBody").append($(addHtml));
            preLoader(false);
        });
    }
    else
    {
        preLoader(false);
    }
 }
if(document.getElementById("batchListBody"))
 {
    readBatch();
 }
 
 function preLoader(action)
   {
        if(action==true)
          $("#preLoader").css("display","flex");
        else
          $("#preLoader").css("display","none");
   }