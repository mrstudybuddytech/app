  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
  import { getFirestore,collection,getDocs,getDoc,doc,where,query,deleteDoc,setDoc } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

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
const plans = [
      { name: "Mini", batch: 3, students: 50, price: 999 },
      { name: "Micro", batch: 6, students: 100, price: 1999 },
      { name: "Large", batch: 9, students: 200, price: 2999 }
    ];

    let selectedPlan = null;
    const GST_RATE = 0.18;
    let applyedCoupan;
    let isDeletedCoupan = false;
    let discount =0;
let COUPONDATA = [];
//{VALID_COUPON:"STUDY10",COUPON_DISCOUNT:0.10}
    const container = document.getElementById('plans');
    const summary = document.getElementById('planSummary');
    const billingBox = document.getElementById('billingBox');
    const pageTitle = document.getElementById('pageTitle');

    plans.forEach((plan, index) => {
      const card = document.createElement('div');
      card.className = 'spec-card';
      card.innerHTML = `
        <div class="plan-title">${plan.name}</div>
        <div class="price">₹${plan.price} / year</div>
        <div class="details">Batch Creation: ${plan.batch}</div>
        <div class="details">Students/Batch: ${plan.students}</div>
        <ul>
          <li>Daily Attendance</li>
          <li>Payment System</li>
          <li>Admit Card Generator</li>
        </ul>
        <button class="select-btn" data-index="${index}">Select Plan</button>
      `;
      container.appendChild(card);
    });

    $(document).ready(function(){
         $(".select-btn").click(function(){
             selectPlan(parseInt( $(this).attr("data-index"),10));
       });
    });
   
    function selectPlan(index) {
      selectedPlan = plans[index];
      document.getElementById("couponInput").value = "";
      updateBill(0);
      billingBox.style.display = "block";
      container.style.display = "none";
      pageTitle.textContent = "Billing";
      billingBox.scrollIntoView({ behavior: "smooth" });
    }

    function updateBill() {
      

      const subtotal = selectedPlan.price - discount;
      const gst = subtotal * GST_RATE;
      const total = subtotal + gst;

      summary.innerHTML = `
        <div><strong>Selected Plan:</strong> ${selectedPlan.name}</div>
        ${discount > 0 ? `<div class="price-row"><span>Coupon Discount:</span><span>-₹${discount.toFixed(2)}</span></div>` : ''}
        <div class="price-row"><span>Subtotal:</span><span>₹${subtotal.toFixed(2)}</span></div>
        <div class="price-row"><span>GST (18%):</span><span>₹${gst.toFixed(2)}</span></div>
        <div class="price-row total"><span>Total:</span><span>₹${total.toFixed(2)}</span></div>
        <div><strong>Batch Creation:</strong> ${selectedPlan.batch}</div>
        <div><strong>Students/Batch:</strong> ${selectedPlan.students}</div>
      `;
    }

    document.querySelector("#couponButton").addEventListener("click", function () {
    const button = document.getElementById("couponButton");
    const couponInput = document.getElementById("couponInput");
    const enteredCoupon = couponInput.value.trim();

    if (button.innerText === "Apply") {
        // Find matching coupon
        const matchedCoupon = COUPONDATA.find(c => c.VALID_COUPON === enteredCoupon);

        if (matchedCoupon) {
            // Apply discount
            discount =selectedPlan.price * matchedCoupon.COUPON_DISCOUNT;
            isDeletedCoupan = matchedCoupon.isDeletedCoupan;
            updateBill();
            couponInput.setAttribute("disabled", true);
            applyedCoupan = matchedCoupon.VALID_COUPON;
            button.innerText = "Remove";
        } else {
            alert("❌ Invalid coupon. ❌");
        }
    } else {
        // Remove coupon
        updateBill(0);  // Reset discount
        button.innerText = "Apply";
        applyedCoupan="";
        couponInput.removeAttribute("disabled");
    }
});

   






    let otpSentTo = "";
    let generatedOTP = "";
    let countdown = 60;
    let timer;
    const emailInput = document.getElementById("email");
    const otpInputs = document.querySelectorAll(".otp-inputs input");
    const resendBtn = document.getElementById("resendBtn");
    const verifyBtn = document.getElementById("verifyBtn");
    const modal = document.getElementById("otpModal");
    const closeModalBtn = document.getElementById("closeModalBtn");

    document.addEventListener("DOMContentLoaded", () => {
      emailInput.addEventListener("blur", () => {
        const email = emailInput.value.trim();
        const isModalOpen = modal.style.display === "block";

    if (isValidEmail(email) && !isModalOpen && email !== otpSentTo) {
      otpSentTo = email;
      sendOTP(email);
    } else {
           alert("Please enter a valid email.");
           otpSentTo = "";
        }
      });

      // OTP box auto-move
      otpInputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
          if (e.target.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
          }
        });
      });

      verifyBtn.addEventListener("click", verifyOTP);

      resendBtn.addEventListener("click", () => {
        if (!resendBtn.disabled && otpSentTo) {
          sendOTP(otpSentTo);
          startResendTimer();
        }
      });

      closeModalBtn.addEventListener("click", closeModal);

      window.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });
    });



  
    function isValidEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }
   
    
    function verifyOTP() {
      let enteredOTP="";
      otpInputs.forEach(input => enteredOTP += input.value);

      if (enteredOTP === generatedOTP) {
        document.querySelector(".pay-btn").addEventListener("click",Payment);
        emailInput.setAttribute("disabled",true);
        closeModal();
      } else {
        alert("❌ Invalid OTP.");
      }
    }



     function openModal() {
      document.getElementById("otpModal").style.display = "block";
      document.querySelectorAll(".otp-inputs input").forEach(input => input.value = "");
      document.querySelector(".otp-inputs input").focus();
    }

    function closeModal() {
      document.getElementById("otpModal").style.display = "none";
      clearInterval(timer);
      otpSentTo="";
    }

    function moveNext(input, index) {
      if (input.value.length === 1 && index < 5) {
        document.querySelectorAll(".otp-inputs input")[index + 1].focus();
      }
    }

    function startResendTimer() {
      countdown = 60;
      const btn = document.getElementById("resendBtn");
      btn.disabled = true;
      btn.textContent = `Resend OTP (${countdown}s)`;

      timer = setInterval(() => {
        countdown--;
        btn.textContent = `Resend OTP (${countdown}s)`;
        if (countdown <= 0) {
          clearInterval(timer);
          btn.disabled = false;
          btn.textContent = "Resend OTP";
          btn.onclick = () => {
            sendOTP(otpSentTo);
            startResendTimer();
          };
        }
      }, 1000);
    }


    function Payment(){
    const name = document.querySelector("input[placeholder='Enter your name']").value.trim();
    const email = document.querySelector("input[placeholder='Enter your email']").value.trim();
    const phone = document.querySelector("input[placeholder='Enter your phone number']").value.trim();
    const company = document.querySelector("input[placeholder='Enter your Company Name']").value.trim();
    const address = document.querySelector("input[placeholder='Enter your Address']").value.trim();
    
   

    if (!name || !email || !phone || !company || !address) {
      alert("Please fill all billing fields.");
      return;
    }


    const subtotal = selectedPlan.price - discount;
    const gst = subtotal * GST_RATE;
    const total = Math.round((subtotal + gst) * 100); // In paise
    const batch = selectedPlan.batch;
    const students = selectedPlan.students;
    const options = {
      key: "rzp_test_YiCQMBATjrcAaT", // Replace with your Razorpay key
      amount: total,
      currency: "INR",
      name: "Study Buddy",
      description: `${selectedPlan.name} Plan Subscription`,
      prefill: {
        name: name,
        email: email,
        contact: phone,
      },
      theme: {
        color: "#4CAF50",
      },
      handler: function (response) {
        // Here, store response to database or call backend
        const clientData = {
                activeProfile:"0",
                name: name,
                email: email,
                contact: phone,
                payment_id:response.razorpay_payment_id,
                batch:batch,
                students:students,
                pass:generateTempPassword(name,phone),
                company:company,
                Address:address
        };
        uploadData(clientData);
      },
      modal: {
        ondismiss: function () {
          alert("Payment cancelled.");
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

function generateTempPassword(name, contact) {
  const partName = name.trim().substring(0, 3).toUpperCase(); // e.g. "RAH"
  const partPhone = contact.slice(-4); // e.g. "3948"
  const randomNum = Math.floor(10 + Math.random() * 90); 
  const tempPass = `${partName}${partPhone}${randomNum}`; 

  return tempPass;
}


 (function(){
    emailjs.init("AhokrgjagKEa4VOMf");
  })();// Replace with your public key

 async function sendOTP(email) {
    preLoader(true);
  try {
    // Check if the email is already registered in "clientData" collection
    const querySnapshot = await getDocs(collection(db, "clientData"));
    let alreadyRegistered = false;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.email && data.email.toLowerCase() === email.toLowerCase()) {
        alreadyRegistered = true;
      }
    });

    if (alreadyRegistered) {
      alert("⚠️ This email is already registered. Try logging in.");
      preLoader(false);
      return;
    }

    // Proceed to send OTP
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    await emailjs.send("service_zn3noyp", "template_ux9v5rb", {
      email: email,
      passcode: `Your OTP is: ${generatedOTP}`
    });

    openModal();
    startResendTimer();
    alert(`✅ OTP sent to ${email} successfully.\nCheck inbox & spam folder.`);
    preLoader(false);

  } catch (err) {
    console.error("❌ Error during OTP send:", err);
    alert("❌ Failed to send OTP. Please try again.");
    preLoader(false);
  }
}



    
    async function uploadData(clientData) {
  preLoader(true);

  try {
    // Generate temp password
    const tempID = generateTempPassword(clientData.contact, clientData.name);
    

    // Upload to Firestore
    await setDoc(doc(db, "clientData", `SBC${tempID}`), clientData);
    console.log("Document successfully written");

    // Delete used coupon
    if (isDeletedCoupan) {
      await deleteDoc(doc(db, "Coupan", applyedCoupan));
    }

    // Send welcome email via EmailJS
    await emailjs.send("service_zn3noyp", "template_qmdablk", {
      email: clientData.email,
      name: clientData.name,
      temp_password: clientData.pass,
      login_url: "https://yourdomain.com/dashboard/login.html" // ✅ Replace with actual URL
    });
    // Redirect on success

    window.location.href = `../dashboard/Success.html?loginID=${clientData.email}&user=${clientData.name}&pass=${clientData.pass}`;
  } catch (e) {
    console.error("Error writing document: ", e);
    alert("Something went wrong. Please try again.");
    preLoader(false);
  } finally {
    preLoader(false);
  }
}

    
       function preLoader(action)
       {
            if(action==true)
              $("#preLoader").css("display","flex");
            else
              $("#preLoader").css("display","none");
       }

async function fetchAllCoupons() {
    preLoader(true);
  const querySnapshot = await getDocs(collection(db, "coupans"));
  COUPONDATA = querySnapshot.docs.map(doc => doc.data());
  preLoader(false);
}
fetchAllCoupons();