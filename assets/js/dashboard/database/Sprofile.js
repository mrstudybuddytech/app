  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
  import { getFirestore,getDoc,doc,query,collection,where,getDocs,updateDoc ,deleteDoc} from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

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
$(document).ready(function () {
  $(".edit").click(function () {
    const $input = $(this).closest("div").prev().find("input, select");
    const $span = $(this).closest(".updateBody").find(".edit-btn");

    // Enable editing
    $input.addClass("edit-input");
    $input.prop("disabled", false).focus();
    $(this).css("display", "none");
    $span.css("display", "flex");

    // Attach one-time click event to update
    $($span).click( function () {
      const newValue = $input.val(); // ✅ Get live value
      const fieldName = $($span).attr("data-update");
      updateData("studentList", getParameters().get("SID"), fieldName, newValue);
    });
  });
$(".Wmessage").click(function(){
     if (confirm("Do you want to delete") == true) {
            preLoader(true);
            deleteDeta("studentList",getParameters().get("SID"));
        }
});
});
async function deleteDeta(collectionName, id) {
  try {
    console.log(`Deleting document from ${collectionName} with ID ${id}`);
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    alert("successfully Deteted! ");
    preLoader(false);
     window.history.back();
  } catch (e) {
    console.error("Error removing document:", e);
    alert("Error removing document: " + e.message);
    preLoader(false);
  }
}

async function updateData(collection,docId,filedName, newData) {
    preLoader(true);
  try {
    const docRef = doc(db, collection, docId); // e.g., "students", "users", etc.

    await updateDoc(docRef, {
      [filedName]: newData
    });

    alert("Document successfully updated!");
    preLoader(false);
    window.location.reload();
  } catch (error) {
    console.error("Error updating document: ", error);
    alert("Failed to update document.");
    preLoader(false);
  }
}

async function readStudent() {
              preLoader(true);
              $(".container").css("display","none");
              const docRef = doc(db, "studentList", getParameters().get("SID")); // Reference to a document in the 'users' collection
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                    document.getElementById("s1").src=docSnap.data().imageUrl;
                    document.getElementById("s2").innerText=docSnap.id;
                    document.getElementById("s3").innerText=docSnap.data().Gender;
                    document.getElementById("s4").value=docSnap.data().FatherName;
                    document.getElementById("s5").value=docSnap.data().MotherName;
                    document.getElementById("s6").value=docSnap.data().MobileNumber;
                    document.getElementById("s7").value=docSnap.data().address;
                    document.getElementById("s8").value=docSnap.data().DOB;
                    document.getElementById("s9").innerText=docSnap.data().DOR;
                    document.getElementsByClassName("Name")[0].innerHTML = docSnap.data().Name;
                    document.getElementsByClassName("Name")[1].value = docSnap.data().Name;
                    callAndMessage(docSnap.data().MobileNumber)
                    fetchList(docSnap.data().parentClassID);
                } else {
                console.log("No such document!");
                alert("No such document!");
                window.history.back();
                }
}

function callAndMessage(MB)
{
     $(document).ready(function () {
        $('.message').on('click', function () {
        const phoneNumber = MB; // Replace with dynamic number if needed
        const message = ''; // Replace or get from input
        const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
        window.location.href = smsUrl;
        });
        $('.callPhone').on('click', function () {
        const phoneNumber = MB; // Replace with the desired number
        const telUrl = `tel:${phoneNumber}`;

        // Open the dialer with the number filled in
        window.location.href = telUrl;
        });
  });
}

async function fetchList(parentClassID) {
  const citiesRef = collection(db, "BatchList");
  const q = query(citiesRef, where("baseID", "==", baseID));
  const querySnapshot = await getDocs(q);

  const html = '<option value="{{value}}" {{selected}}>{{name}}</option>';
  $("#batchList").empty(); 

  querySnapshot.forEach((doc) => {
    const docId = doc.id;
    const name = doc.data().Name;

    // Check if this is the parentClassID to be selected
    const selected = (docId === parentClassID) ? 'selected' : '';

    const optionHtml = html
      .replace("{{value}}", docId)
      .replace("{{name}}", name)
      .replace("{{selected}}", selected);

    $("#BatchList").append(optionHtml);
    $(".container").css("display","flex");
    preLoader(false);
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

        

function preLoader(action)
   {
        if(action==true)
          $("#preLoader").css("display","flex");
        else
          $("#preLoader").css("display","none");
   }
readStudent();