  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
  import { getFirestore,collection,getDocs,getDoc,doc,where,query,setDoc,orderBy,limit  ,serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

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

      const baseID = localStorage.getItem("baseID"); // 🔁 Replace with dynamic values if needed
      const SID = getParameters().get("SID");
  

async function readStudent() {
                    preLoader(true);
                    $(".container").css("display","none");
                    const docRef = doc(db, "studentList", getParameters().get("SID")); // Reference to a document in the 'users' collection
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                          document.getElementById("imageUrl").src=docSnap.data().imageUrl;
                          document.getElementsByClassName("SNAME")[0].innerHTML = docSnap.data().Name;
                          document.getElementsByClassName("SNAME")[1].innerHTML = docSnap.data().Name;
                          document.getElementsByClassName("MB")[0].innerHTML = docSnap.data().MobileNumber;
                          document.getElementsByClassName("MB")[1].innerHTML = docSnap.data().MobileNumber;
                          preLoader(false);
                      } else {
                      console.log("No such document!");
                      alert("No such document!");
                      preLoader(false);
                      }
}
readStudent();



  let lastVisible = null;
  let isLoading = false;
  const PAGE_SIZE = 5;

  async function fetchTransactions(scroll = false) {
    const chatContainer = document.getElementById('chatContainer');
    if (isLoading) return;
    isLoading = true;

     let q = collection(db, "PaymentHistory");
    let queryRef = query(q,
      where("baseID", "==", baseID),
      where("SID", "==", SID),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE)
    );

    if (lastVisible && scroll) {
      queryRef = query(queryRef, startAfter(lastVisible));
    }

    try {
      const snapshot = await getDocs(queryRef);

      if (snapshot.empty ) {
        if (!scroll) {
          chatContainer.innerHTML = "<p>No transactions found.</p>";
        }
        isLoading = false;
        return;
      }

     

      snapshot.forEach(doc => {
        const t = doc.data();

        const dateDiv = document.createElement('div');
        dateDiv.className = 'date-label';
        dateDiv.innerText = t.date;
        let imageurl="#";
        if(t.method=="cash")
        {
          imageurl="../assets/images/img/money.png";
        }
        else
        {
          imageurl="../assets/images/img/UPILOGO.svg";
        }
        const card = document.createElement('div');
        card.className = 'chat-card';
        card.innerHTML = `
          <h2>₹${t.amount}</h2>
          <p>Received in <img src="${imageurl}" width="16" style="vertical-align: middle;"> ${t.method}</p>
          <span>${t.time}</span>
          <input name="amount" type="hidden" value="${t.amount}"/>
          <input name="time" type="hidden" value="${t.time}"/>
          <input name="date" type="hidden" value="${t.date}"/>
          <input name="ref" type="hidden" value="${doc.id}"/>
          <input name="method" type="hidden" value="${t.method}"/>
        `;

        chatContainer.appendChild(dateDiv);
        chatContainer.appendChild(card);
      });

      lastVisible = snapshot.docs[snapshot.docs.length - 1];
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }

    isLoading = false;
  }

  // 👇 Initial Load
  fetchTransactions();

  // 👇 Scroll Event
 document.getElementById('chatContainer').addEventListener('scroll', () => {
    if (
      document.getElementById('chatContainer').scrollTop + chatContainer.clientHeight >=
      document.getElementById('chatContainer').scrollHeight - 10
    ) {
      fetchTransactions(true); // Load next page
    }
  });









      

async function uploadPayment() {
    const method = document.getElementById("payment-method").value;
    const amountInput = document.getElementById("payment-amount").value.trim();
    
    if (!amountInput || isNaN(amountInput)) {
      alert("Please enter a valid amount.");
      return;
    }
    if(method=="upi")
      {
        document.getElementById("overlay").style.display="none";
      }
    preLoader(true);
    const now = new Date();
    const date = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const transaction = {
      baseID:baseID,
      SID:getParameters().get("SID"),
      amount: amountInput,
      method: method,
      date: date,
      time: time,
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, "PaymentHistory", generateId()), transaction);
      alert("Payment history uploaded successfully!");
      preLoader(false);
      // Optionally reload or update UI
      document.getElementById("payment-amount").value = "";
      lastVisible = null;
      document.getElementById("chatContainer").innerHTML = ""; // clear old data
      fetchTransactions(); // reload fresh
    } catch (error) {
      console.error("Error uploading payment:", error);
      alert("Error uploading payment.");
      preLoader(false);
    }
  }


function generateId() {
    return `PY${Math.random().toString(36).substr(2, 9)}`;
}

      
function preLoader(action)
   {
        if(action==true)
          $("#preLoader").css("display","flex");
        else
          $("#preLoader").css("display","none");
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







document.getElementById("showPaymentBox").addEventListener("click",showPaymentBox);
  function showPaymentBox() {
    const method = document.getElementById("payment-method").value;
    const amount = document.querySelector(".bottom-input input").value.trim();
    const overlay = document.getElementById("overlay");
    const upiBox = document.getElementById("upiBox");
    const cashBox = document.getElementById("directBox");
    const qrImg = upiBox.querySelector("img");

    if (!method) {
      alert("Please select a payment method.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (method === "upi") {
      // Generate new UPI QR with entered amount
      const upiString = `upi://pay?pa=9060242143@ptaxis&am=${amount}&cu=INR`;
    const encodedUPI = encodeURIComponent(upiString);
     const qrURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedUPI}&size=200x200`;
      qrImg.src = qrURL;

      upiBox.style.display = "block";
      cashBox.style.display = "none";
       overlay.style.display = "flex";
    } else if (method === "cash") {
         uploadPayment();
    }

   
  }
  document.getElementById("payUpi").addEventListener("click",function(){
     uploadPayment();
  });
  document.querySelector(".close-btn").addEventListener("click",function(){
     document.getElementById("overlay").style.display = "none";
  });


  document.getElementById("shareBtn").addEventListener("click",sharePaymentImage);

 async function sharePaymentImage() {
    const section = document.querySelector('.popup-content'); // your capture area
    const shareBtn = document.querySelector('#shareBtn');
    const backBtn = document.querySelector('.popup-back');
    const headerBody = document.querySelector(".popup-header");

    // Hide buttons before capture
    shareBtn.style.display = 'none';
    backBtn.style.display = 'none';
    headerBody.style="display: flex; justify-content: center; ";

    try {
      const canvas = await html2canvas(section, { backgroundColor: '#fff' });
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'payment-history.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Payment Receipt',
          text: 'Here is the payment confirmation',
          files: [file],
        });
      } else {
        alert('Sharing is not supported on this device.');
      }
    } catch (error) {
      console.error("Error while sharing:", error);
      alert("Sharing failed. Try again.");
    }

    // Show buttons back after capture
    shareBtn.style.display = 'inline-block';
    backBtn.style.display = 'inline-block';
    headerBody.style="";
  }


  


document.getElementById("closeHistory").addEventListener('click', () => {
    document.getElementById("paymentPopup").style.display = 'none';
});
const chatContainer = document.getElementById('chatContainer');

   

    // Go back function
document.querySelector(".back-button").addEventListener("click",function(){
 window.history.back();
});
    // Profile image popup logic
const profileImage = document.querySelector('.header img');
const imagePopup = document.getElementById('imagePopup');
const popupImage = document.getElementById('popupImage');

profileImage.addEventListener('click', () => {
  popupImage.src = profileImage.src;
  imagePopup.style.display = 'flex';
});

imagePopup.addEventListener('click', () => {
  imagePopup.style.display = 'none';
});
// Click any transaction card to show popup
document.addEventListener('click', function (e) {
    const card = e.target.closest('.chat-card');
   if (card) {
    

    // Access all inputs by name inside the clicked card
    const inputs = card.querySelectorAll('input');

    // Example: Get specific inputs by name
    const amount = card.querySelector('input[name="amount"]');
    const time = card.querySelector('input[name="time"]');
    const data = card.querySelector('input[name="date"]');
    const ref = card.querySelector('input[name="ref"]');
    const method = card.querySelector('input[name="method"]');

    // Now you can use their values
    const amountValue = amount?.value || '';
    const createdAtValue = data.value  + " " +time.value ;
    const refValue = ref?.value || '';
    let methodValue = method?.value||"";

    // Fill popup fields or use data
    document.getElementById('AH').innerHTML = amountValue;
    if(methodValue=="upi")
    {
      methodValue = "UPI | 9060242143@ptaxis";
    }
    document.getElementById('PM').innerHTML = methodValue;
    document.getElementById('timestamp').innerHTML = createdAtValue;
    document.getElementById('ref').innerHTML = refValue;
    document.getElementById("AHE").innerHTML = numberToWords(amountValue);
    document.getElementById('paymentPopup').style.display = 'flex';
  }
  });

function numberToWords(num) {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
    'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen',
    'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
    'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  function inWords(n) {
    if ((n = n.toString()).length > 9) return 'Overflow';
    const nStr = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!nStr) return; 

    let str = '';
    str += (nStr[1] != 0) ? (a[Number(nStr[1])] || b[nStr[1][0]] + ' ' + a[nStr[1][1]]) + ' Crore ' : '';
    str += (nStr[2] != 0) ? (a[Number(nStr[2])] || b[nStr[2][0]] + ' ' + a[nStr[2][1]]) + ' Lakh ' : '';
    str += (nStr[3] != 0) ? (a[Number(nStr[3])] || b[nStr[3][0]] + ' ' + a[nStr[3][1]]) + ' Thousand ' : '';
    str += (nStr[4] != 0) ? (a[Number(nStr[4])] || b[nStr[4][0]] + ' ' + a[nStr[4][1]]) + ' Hundred ' : '';
    str += (nStr[5] != 0) ? ((str != '') ? 'and ' : '') + 
            (a[Number(nStr[5])] || b[nStr[5][0]] + ' ' + a[nStr[5][1]]) + ' ' : '';

    return str.trim() + 'Rupees Only';
  }

  return inWords(num);
}


