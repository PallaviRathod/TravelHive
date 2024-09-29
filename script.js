//  language
 function changeLanguage() {
    var language = document.getElementById('language').value;
    
    if (language === 'en') {
      document.getElementById('welcome-message').textContent = 'Where Excellence Takes You. With a strong commitment to customer satisfaction and a passion for travel, TravelHive offers exceptional service and seamless journeys for all your travel needs.';
    } else if (language === 'hin') {
      document.getElementById('welcome-message').textContent = 'उत्कृष्टता आपको कहाँ ले जाती है। ग्राहक संतुष्टि के प्रति दृढ़ प्रतिबद्धता और यात्रा के प्रति जुनून के साथ, ट्रैवलहाइव आपकी सभी यात्रा आवश्यकताओं के लिए असाधारण सेवा और निर्बाध यात्रा प्रदान करता है।';
    } 
  }


// login popup
const showPopupBtn = document.querySelector(".btn");
const closePopupBtn = document.querySelector(".close_btn");
const formPopup = document.querySelector(".form_popup");
const hidePopupBtn = document.querySelector(".close-btn");

showPopupBtn.addEventListener("click", () => {
    document.body.classList.toggle("show_popup");
});

closePopupBtn.addEventListener("click", () => {
    document.body.classList.remove("show_popup");
});


document.addEventListener("DOMContentLoaded", function () {
  const formPopup = document.getElementById("form_popup");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const successMessage = document.getElementById("success-message");

  if (formPopup && emailInput && passwordInput && emailError && passwordError && successMessage) {
      formPopup.addEventListener("submit", function (e) {
          e.preventDefault(); // Prevent form submission

          // Clear previous error messages
          emailError.textContent = "";
          passwordError.textContent = "";
          successMessage.textContent = "";

          // Validate email
          const email = emailInput.value;
          const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          if (!emailPattern.test(email)) {
              emailError.textContent = "Please enter a valid email address.";
              return;
          }

          // Validate password
          const password = passwordInput.value;
          const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
          if (!passwordPattern.test(password)) {
              passwordError.textContent = "Password must be at least 8 characters long, contain at least a special character and an uppercase letter.";
              return;
          }

          // Simulate successful login
          successMessage.textContent = "Login successful! Welcome, " + email;

          // Store user data in local storage
          saveData(email, password);

          // Simulate getting user data (this is just a placeholder)
          const userData = {
              email: email,
              password: password
          };

          // Use the userData object as needed in your application
          console.log("User data:", userData);
      });
  }
});

function saveData(email, password) {
  // Get existing users from local storage
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Add new user to the users array
  users.push({ email: email, password: password });

  // Save the updated users array back to local storage
  localStorage.setItem("users", JSON.stringify(users));
}

function displayUsers() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  console.log("All users:", users);
}

// Call displayUsers to show all stored users
displayUsers();


// dates for departure & return
document.addEventListener("DOMContentLoaded", function() {
    const departureInput = document.getElementById("departure-date");
    const returnInput = document.getElementById("return-date");

    const departurePicker = flatpickr(departureInput, {
        dateFormat: "Y-m-d",
    });

    const returnPicker = flatpickr(returnInput, {
        dateFormat: "Y-m-d",
    });

    document.getElementById("departure-btn").addEventListener("click", function() {
        departurePicker.open();
    });

    document.getElementById("return-btn").addEventListener("click", function() {
        returnPicker.open();
    });
});


// chatbot feature
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input .send-btn");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "sk-0aOaPm8EcW3I4PZjgdEX4xYfPHzNTrubCIjMVcStmLT3BlbkFJfxYGjnHqcLKTosDF_6Www05V2_4E82MMh2apQxJ7MA";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p>${message}</p>`
      : `<span><i class="fa-solid fa-robot"></i></span>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
};

const generateResponse = (incomingChatLi) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",  // Update the model to a valid one
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    }),
  };

  // Send request to bot
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      const messageElement = incomingChatLi.querySelector("p");
      if (data.choices && data.choices.length > 0) {
        messageElement.textContent = data.choices[0].message.content;
      } else {
        messageElement.textContent = "No response from the bot.";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      const messageElement = incomingChatLi.querySelector("p");
      messageElement.textContent = "Oops! Something went wrong. Please try again.";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append user's message to chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  // Create and append an incoming chat item with a placeholder
  const incomingChatLi = createChatLi("...", "incoming");
  chatbox.appendChild(incomingChatLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);

  // Generate bot response
  generateResponse(incomingChatLi);
};

chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

// Event listener for send button
sendChatBtn.addEventListener("click", handleChat);

// Optional: Allow pressing Enter key to send message
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // Prevent new line on Enter
    handleChat();
  }
});

// Adjust the height of the textarea
chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});
