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
   
   const attendanceData = [];

const baseID = localStorage.getItem("baseID");

  async function readAttandance() {
              const citiesRef = collection(db, "attendance");
              const q = query(citiesRef, where("baseID", "==",baseID),where("parentClassID","==",getParameters().get("BID")));
              const querySnapshot = await getDocs(q);
              if(!querySnapshot.empty){
              querySnapshot.forEach((doc) => {
                 const modal = {
                    parentClassID:getParameters().get("BID"),
                    SID: doc.data().SID,
                    name: doc.data().Name, 
                    phone:doc.data().MB,
                    date: doc.data().Date, 
                    status: doc.data().current};
                  attendanceData.push(modal);       
              });
              
            InitialLoad();
              }
  }
readAttandance();


  const tbody = document.getElementById("attendanceBody");
  const dateInput = document.getElementById("dateFilter");

  function renderTable(data) {
    tbody.innerHTML = "";
    if (data.length === 0) {
      tbody.innerHTML = "<tr><td colspan='5'>No records found.</td></tr>";
      return;
    }
    let i=1;
    data.forEach(entry => {
      const row = document.createElement("tr");
      row.dataset.sid = entry.SID;
      row.innerHTML = `
        <td>${i}</td>
        <td>${entry.SID}</td>
        <td>${entry.name}</td>
        <td>${entry.phone}</td>
        <td>${entry.date}</td>
        <td><span class="badge ${entry.status}">${entry.status.toUpperCase()}</span></td>
      `;
      row.addEventListener("click", () => showPopup(entry.SID));
      tbody.appendChild(row);
      i++;
    });
  }

  function getLatestAvailableDate() {
    const today = new Date();
      const dates = [...new Set(attendanceData.map(e => e.date))];
      const validDates = dates.filter(d => new Date(d) <= today);
      validDates.sort((a, b) => new Date(b) - new Date(a)); // latest first
      return validDates[0] || null;
  }

  function showPopup(sid) {
    const studentRecords = attendanceData.filter(e => e.SID === sid);
    const popup = document.getElementById("popupOverlay");
    const content = document.getElementById("popupContent");

    if (studentRecords.length > 0) {
      const name = studentRecords[0].name;
      let html = `<strong style="margin-top:10px;width:100%;color:black; font-family: 'Segoe UI', sans-serif;font-size:20px;">${name}</strong><br/><br/><table style=" border-collapse: collapse;">`;
      html += `<tr><th>Date</th><th>Status</th></tr>`;
      studentRecords.forEach(r => {
        html += `<tr><td>${r.date}</td><td><span class="badge ${r.status}">${r.status.toUpperCase()}</span></td></tr>`;
      });
      html += `</table>`;
      content.innerHTML = html;
      popup.style.display = "flex";
    }
  }

  $(document).ready(function(){
    $(".popup-close").click(function(){
       closePopup();
    });
  });
  function closePopup() {
    document.getElementById("popupOverlay").style.display = "none";
  }

  function loadAttendanceByDate(date) {
  const filtered = attendanceData.filter(d => d.date === date);
  renderTable(filtered);
}

  // Initial load
 function InitialLoad()
 {
     const latestDate = getLatestAvailableDate();
    if (latestDate) {
      dateInput.value = latestDate;
      loadAttendanceByDate(latestDate);
    } else {
      tbody.innerHTML = "<tr><td colspan='5'>No data found</td></tr>";
    }
 }
  // On date change
  dateInput.addEventListener("change", () => {
    const selected = dateInput.value;
    loadAttendanceByDate(selected);
  });

  $("#addAttandance").click(function(){
 const matched =   attendanceData.find(student => student.date === date());

  if(!matched)
    window.location.href=`../dashboard/index.html?p=setAttandance&BID=${getParameters().get("BID")}`;
  else
    alert("marked attandance today")
  });

    function date()
{
    let d = new Date();

    let day = String(d.getDate()).padStart(2, "0");

    let month = String(d.getMonth() + 1).padStart(2, "0");

    let year = d.getFullYear();

    let d1 = year + "-" + month + "-" + day;
    return d1;
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