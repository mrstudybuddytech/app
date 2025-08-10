  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
  import { getFirestore, setDoc,doc,getCountFromServer} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

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
      // Initialize Cloud Firestore and get a reference to the service
 export   const db = getFirestore(app);
 export  async function uploadData(collectionName, documentId, data) {

   if(getSize(data.baseID)==localStorage.getItem("batch")){
      alert("all alloted batch? you are successfully created!");
      return;
   }
      
       
          preLoader(true);
          try {
            await setDoc(doc(db, collectionName, documentId), data);
            console.log("Document successfully written");
            alert('successfull');
            preLoader(false);
            window.location.reload();
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

  async function getSize(baseID)
   {
     const q = query(
                    collection(db, "BatchList"),
                    where("baseID", "==", baseID)
                    );
    const snapshot = await getCountFromServer(q);
    return  snapshot?snapshot.data().count:0;
   }



