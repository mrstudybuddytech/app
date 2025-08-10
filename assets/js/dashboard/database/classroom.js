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
 $(document).ready(function(){
     $(".headerActive").click(function(){
        if(!$(this).hasClass('active')){
          $('.headerActive').removeClass("active");
          $('.headerActive').addClass("dactive");
          $(this).removeClass('dactive'); 
          $(this).addClass('active');
          $('.headerActive').children('span').removeClass('activeSpan');
          $('.headerActive').children('span').addClass('dactiveSpan');
           $(this).children('span').removeClass('dactiveSpan');
          $(this).children('span').addClass('activeSpan');
          if($(this).attr("data-id")=="SLISt")
          {
               $("#ListBody").empty();
               reCall();
          }
          else
          {
            $("#ListBody").empty();
            $("#noData").css("display","flex");
          }
        }
     });
  });
  let studentListHtml=[];
  function reCall()
  {
    if(studentListHtml.length>0){
    for(let i=0;i<studentListHtml.length;i++)
    {
       $("#ListBody").append(studentListHtml[i]);
    }
     $("#noData").css("display","none");
    }
    else
    {
         $("#noData").css("display","flex");
    }
  imageView();
  }
  getStudentList("JYPL6341C",$("#SLIST").attr("data-baseID"));

        async function getStudentList(baseID,parentClassID) {
      
               preLoader(true);
                    let batchHtml = "";
                     $.get("../dashboard/studentModal.html", function(data) {
                           batchHtml = data;
                        });
              const Ref = collection(db, "studentList");
              const q = query(Ref, where("baseID", "==", baseID),where("parentClassID" , "==" , parentClassID));
              const querySnapshot = await getDocs(q);
               if(!querySnapshot.empty){
                 $("#noData").css("display","none");
              querySnapshot.forEach((doc) => {
                 let addHtml= batchHtml.replace("{{Name}}",doc.data().Name)
                  .replace("{{MB}}",doc.data().MobileNumber)
                  .replace("{{studentID}}",doc.id)
                  .replace("{{imageUrl}}",doc.data().imageUrl)
                  .replace("{{SID}}",doc.id);
                  studentListHtml.push(addHtml);
                  $("#ListBody").append($(addHtml));
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