  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
  import { getFirestore,collection,getDocs,getDoc,doc,where,query,deleteDoc,setDoc,updateDoc } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

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
    
      const email = document.getElementById("loginEmail");
      const pass = document.getElementById("loginPass");
      document.getElementById("Login").addEventListener("click",function(){
         if(email &&pass && email.value!=="" && pass.value!=="")
         {
            login();
         }
         else
         {
            alert("enter required filled");
         }
      });
     async function login()
      {
         try
         {
            preLoader(true);
            const querySnapshot = await getDocs(collection(db, "clientData"));
            localStorage.setItem("isLogin","flase");
               querySnapshot.forEach((doc) => {
                 const data = doc.data();
                 if (data.email && data.email.toLowerCase() === email.value.toLowerCase() && data.pass === pass.value) {
                    localStorage.setItem("isLogin","true");
                    localStorage.setItem("baseID",doc.id);
                    localStorage.setItem("batch",data.batch);
                    localStorage.setItem("students",data.students);
                    localStorage.setItem("userData", JSON.stringify({ name: data.name, email: data.email,batch:data.batch,students:data.students,company:data.company}));
                 }
               });
               if(localStorage.getItem("isLogin") && localStorage.getItem("isLogin")=="true")
               {
                  preLoader(false);
                  window.location.href="../dashboard/index.html?id=Home";
               }
               else
               {
                 alert("❌ Email & Password wrong ?❌");
                 preLoader(false);
               }
         }catch(e)
         {
           console.error("❌ Error during Login:", e);
            alert("❌ Failed to login. Please try again.");
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












       
    let otpSentTo = "";
    let generatedOTP = "";
    let countdown = 60;
    let timer;
    const emailInput = document.getElementById("forgotEmail");
    const otpInputs = document.querySelectorAll(".otp-inputs input");
    const resendBtn = document.getElementById("resendBtn");
    const verifyBtn = document.getElementById("verifyBtn");
    const modal = document.getElementById("otpModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const newPass = document.getElementsByClassName("newPass");

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
        document.querySelector("#ResetLink").addEventListener("click",updatePass);
        emailInput.setAttribute("disabled",true);
        document.getElementsByClassName("newPass")[0].style="dispaly:block";
        document.getElementsByClassName("newPass")[1].style="dispaly:block";
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

    
     (function(){
        emailjs.init("AhokrgjagKEa4VOMf");
      })();// Replace with your public key
     let alreadyRegistered = false;
     let clentID="";
     async function sendOTP(email) {
        preLoader(true);
      try {
        // Check if the email is already registered in "clientData" collection
        const querySnapshot = await getDocs(collection(db, "clientData"));
       
    
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.email && data.email.toLowerCase() === email.toLowerCase()) {
            clentID = doc.id;
            alreadyRegistered = true;
          }
        });
    
        if (!alreadyRegistered) {
          alert("⚠️ This email not  registered. Try with valied emaid in.");
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
    
    async function updatePass()
    {
        if(newPass && newPass[0].value=="" && newPass[1].value=="")
        {
            alert("Please Enter new password?");
             return;
        }
        if(newPass[0].value!==newPass[1].value)
        {
            alert("Both section in same pass word enter");
             return;
        }
           preLoader(true);
           try {
             const docRef = doc(db, "clientData", clentID); // e.g., "students", "users", etc.
         
             await updateDoc(docRef, {
               pass: newData
             });
         
             alert("password successfully updated!");
             preLoader(false);
             window.location.reload;
           } catch (error) {
             window.location.reload;
             console.error("Error updating document: ", error);
             alert("Failed to update document.");
             preLoader(false);
           }

    }
