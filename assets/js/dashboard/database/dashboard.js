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

      async function getTotalStudent()
         {
           const q = query(
                          collection(db, "studentList"),
                          where("baseID", "==", baseID),
                          );
          const snapshot = await getCountFromServer(q);
          const size = snapshot?snapshot.data().count:0;
          const totalStudent = localStorage.getItem("batch")*localStorage.getItem("students");
          document.getElementById("STS").innerHTML=`${size}`;
          document.getElementById("TS").innerHTML=`${size}/${totalStudent}`;
          document.getElementById("TSL").style=`width:${(size*100)/totalStudent}%;`;
         }
        
      async function getTotalBatch()
         {
           const q = query(
                          collection(db, "BatchList"),
                          where("baseID", "==", baseID),
                          );
          const snapshot = await getCountFromServer(q);
          const size = snapshot?snapshot.data().count:0;
          const batch = localStorage.getItem("batch");
           document.getElementById("STB").innerHTML=`${size}`;
          document.getElementById("TB").innerHTML=`${size}/${batch}`;
          document.getElementById("TBL").style=`width:${(size*100)/batch}%;`;
         }
      getTotalStudent();
      getTotalBatch();
      
      
