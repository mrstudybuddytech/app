   import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
   import { getFirestore,collection,getDocs,where,query,addDoc} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';
 
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
 let students =[];
 
const baseID = localStorage.getItem("baseID");
let currentIndex = 0;
let attendanceResponses = [];
async function readStudent() {
            preLoader(true);
            $(".app-container").css("display","none");
            const citiesRef = collection(db, "studentList");
            const q = query(citiesRef, where("baseID", "==",baseID),where("parentClassID","==",getParameters().get("BID")));
            const querySnapshot = await getDocs(q);
            if(!querySnapshot.empty){
            querySnapshot.forEach((doc) => {
               const studentModal = {
                    id: doc.id,
                    name: doc.data().Name,
                    father: doc.data().FatherName,
                    phone: doc.data().MobileNumber,
                    photo: doc.data().imageUrl
                };
                students.push(studentModal);       
            });
             renderStudent(currentIndex);
             $(".app-container").css("display","flex");
            preLoader(false);
            }
            else
            {
              alert("not any student register");
              preLoader(false);
              window.history.back();
            }
}
readStudent();


function preLoader(action)
   {
        if(action==true)
          $("#preLoader").css("display","flex");
        else
          $("#preLoader").css("display","none");
    }

function renderStudent(index) {
      const s = students[index];
      document.getElementById("name").innerText = s.name;
      document.getElementById("fatherName").innerText = s.father;
      document.getElementById("studentID").innerText = s.id;
      document.getElementById("phone").innerText = s.phone;
      document.getElementById("photo").src = s.photo;

      document.querySelectorAll('input[name="status"]').forEach(r => {
        r.checked = false;
      });
      document.getElementById("markedStatus").innerText = "";

      const saved = attendanceResponses.find(r => r.SID === s.id);
      if (saved) {
        const radioToCheck = document.querySelector(`input[name="status"][value="${saved.current}"]`);
        if (radioToCheck) radioToCheck.checked = true;
        document.getElementById("markedStatus").innerText = `✅ Marked as ${saved.current}`;
      }

      document.querySelectorAll('input[name="status"]').forEach(radio => {
        radio.addEventListener("change", () => {
          const value = radio.value;
          document.getElementById("markedStatus").innerText = `✅ Marked as ${value}`;
        });
      });

      // Change button text
    const nextBtn = document.querySelector('.next');
      nextBtn.innerText = currentIndex === students.length - 1 ? "SUBMIT" : "NEXT";
    }

    function nextStudent() {
      const selected = document.querySelector('input[name="status"]:checked');
      if (!selected) {
        alert("Please select Present, Absent, or Leave before proceeding.");
        return;
      }

      const current = students[currentIndex];

      // Replace existing entry
      attendanceResponses = attendanceResponses.filter(r => r.SID !== current.id);
      attendanceResponses.push({
        SID: current.id,
        Name:current.name,
        MB:current.phone,
        parentClassID:getParameters().get("BID"),
        baseID: baseID,
        Date :date(),
        current: selected.value,
        action: "Marked"
      });

      if (currentIndex < students.length - 1) {
        currentIndex++;
        animateCard();
        renderStudent(currentIndex);
      } else {
         if (confirm(" last Student Attendance marked ✅! \n are you sure sumbit attandance data") == true) {
             submitAttendance();
         }
        console.log("Attendance Result:", attendanceResponses);
      }
    }

    function prevStudent() {
      if (currentIndex > 0) {
        currentIndex--;
        animateCard();
        renderStudent(currentIndex);
      }
    }

    function animateCard() {
      const card = document.getElementById("card");
      card.style.transform = "scale(0.97)";
      setTimeout(() => {
        card.style.transform = "scale(1)";
      }, 150);
    }

   async function submitAttendance() {
                
  try {
    preLoader(true); 
    const attendanceRef = collection(db, "attendance");

    for (let record of attendanceResponses) {
      await addDoc(attendanceRef, record);
    }

    alert("✅ All attendance has been successfully submitted to Firestore!");
    console.log("📤 Uploaded to Firestore:", attendanceResponses);

    // Optionally clear local responses
    preLoader(false);
    window.history.back();
    
    // Redirect or reload after success
    // location.reload();
    
  } catch (error) {
    preLoader(false);
    console.error("❌ Error uploading attendance:", error);
    alert("❌ Failed to upload attendance. Please try again.");
  }
}




document.querySelector(".back").addEventListener("click",function(){
   prevStudent();
});
document.querySelector(".next").addEventListener("click",function(){
   nextStudent();
});
document.querySelector(".back-btn").addEventListener("click",function(){
   prevStudent();
});

 function getParameters() 
         {
            let urlString = window.location.href;
            let paramString = urlString.split('?')[1];
            let params_arr = paramString.split('&');
            let myMap = new Map();
              for(let i = 0; i < params_arr.length; i++) {
                let pair = params_arr[i].split('=');
                myMap.set(pair[0], pair[1]);
            }
            return myMap;
        }

  function date()
{
    let d = new Date();

    let day = String(d.getDate()).padStart(2, "0");

    let month = String(d.getMonth() + 1).padStart(2, "0");

    let year = d.getFullYear();

    let d1 = year + "-" + month + "-" + day;
    return d1;
}