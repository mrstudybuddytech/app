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
let studentList =[];
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
                const studentData = {
                  id: doc.id,
                  ...doc.data()
                };
                studentList.push(studentData);
                let  url,urlName;
                if(getParameters().get("p")=="studentProfile")
                {
                  url = '../dashboard/index.html?p=studentProfile&SID='+doc.id;
                  urlName="View Profile";
                }
                else
                {
                  url = '../dashboard/pay.html?p=Payment&SID='+doc.id;
                  urlName = "View Payment"
                }
                 let addHtml= batchHtml
                  .replace("{{Name}}",doc.data().Name)
                  .replace("{{MB}}",doc.data().MobileNumber)
                  .replace("{{studentID}}",doc.id)
                  .replace("{{imageUrl}}",doc.data().imageUrl)
                  .replace("{{SID}}",url)
                  .replace("{{urlName}}",urlName);
                  $("#bodyListStudent").append($(addHtml));
                  preLoader(false);
                  
              });
            }
            else
            {
              preLoader(false);
            }
            imageView();
      }


     
      
function preLoader(action)
   {
        if(action==true)
          $("#preLoader").css("display","flex");
        else
          $("#preLoader").css("display","none");
   }

readStudent();

   function imageView()
 {
   $(document).ready(function(){
      $(".imageView").click(function(){
            $("#photoBody").css("display","flex");
            $("#imageURL").attr("src",$(this).attr("src"));
      });
      $("#closeCamera").click(function(){
           $("#photoBody").css("display","none");
           $("#imageURL").attr("src","");
      });
   });
 }

document.getElementById("Search").addEventListener("keyup", function () {
  filterStudent(this.value);
});
 function filterStudent(lowerKeyword ) {
  const keyword = lowerKeyword .toLowerCase();

  $("#bodyListStudent").empty(); // clear old data

  if (!keyword) {
    // Show all
    studentList.forEach(showStudentCard);
  } else {
    const filtered = studentList.filter((student) =>
      student.MobileNumber?.includes(keyword) ||
      student.id?.toLowerCase().includes(keyword) ||
      student.Name?.toLowerCase().includes(keyword)
    );

    if (filtered.length === 0) {
      $("#bodyListStudent").html('<div id="noData" style="width: 100%; color: red; display:  flex; justify-content: center; font-size: 25px; font-weight: bold;"> No Student Data Found </div>');
    } else {
      filtered.forEach(showStudentCard);
    }
  }
}
function showStudentCard(student) {
  $.get("../dashboard/studentModal.html", function (template) {
    const addHtml = template
      .replace("{{Name}}", student.Name)
      .replace("{{MB}}", student.MobileNumber)
      .replace("{{studentID}}", student.id)
      .replace("{{imageUrl}}", student.imageUrl)
      .replace("{{SID}}", student.id);

    $("#bodyListStudent").append($(addHtml));
  });
}

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