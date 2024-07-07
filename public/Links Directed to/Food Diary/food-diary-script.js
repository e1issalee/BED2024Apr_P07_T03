// ======================= Navigation Bar  =======================
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

// Add a transition effect for smooth appearance/disappearance
navbar.style.transition = 'top 0.6s';

window.addEventListener('scroll', function() {
  let scrollTop = window.scrollY || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    // Downscroll
    navbar.style.top = '-200px'; // Hide the navbar by moving it up
  } else {
    // Upscroll
    navbar.style.top = '0'; // Show the navbar
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For mobile or negative scrolling
});

// ======================= Tab Navigation Bar  =======================
const tabBtns = document.querySelectorAll(".tab-btn"); 
const tabs = document.querySelectorAll(".tab-menu li"); 

// Function to save tab data to the database
async function saveTabData(tabIndex) {
  try {
      const tabName = tabs[tabIndex].innerText.toLowerCase(); 
      await fetch('http://localhost:3000/tabNames', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              tabName: tabName,
              // Include any other relevant data you need to save
          }),
      });
      console.log('Tab data saved successfully!');
  } catch (error) {
      console.error('Error saving tab data:', error);
      alert('Error saving tab data');
  }
}
  async function removeFoodItem(itemId, currentTab) {
      if (itemId && currentTab) {
        try {
            const response = await fetch(`http://localhost:3000/deleteFoodItem/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete food item');
            }

            const foodItem = document.querySelector(`.food-item[data-tab="${currentTab}"][data-item-id="${itemId}"]`);
            if (foodItem) {
                foodItem.remove();
                alert('Food item deleted successfully!');
            } else {
                console.error('Food item not found in UI');
                alert('Error deleting food item');
            }
        } catch (error) {
            console.error('Error deleting food item:', error);
            alert('Error deleting food item');
        }
    } else {
        console.error('Cannot delete item: itemId is undefined');
        alert('Cannot delete item: itemId is undefined');
    }
  }

// Function to handle tab navigation
const handleTabNavigation = (tabBtnClick) => {
  tabBtns.forEach((tabBtn, index) => {
      if (index === tabBtnClick) {
          tabBtn.classList.add("active");
      } else {
          tabBtn.classList.remove("active");
      }
  });

  tabs.forEach((tab, index) => {
      if (index === tabBtnClick) {
          tab.classList.add("active");
      } else {
          tab.classList.remove("active");
      }
  });

  // Save tab data to the database
  saveTabData(tabBtnClick);

  // Fetch food items for the current tab
  const tabName = tabBtns[tabBtnClick].getAttribute('data-tab');
  fetchFoodItems(tabName).catch(error => {
      console.error('Error fetching food items:', error);
  });
}

// Event listener for tab button clicks
tabBtns.forEach((tabBtn, index) => {
  tabBtn.addEventListener('click', () => {
      handleTabNavigation(index);
  });
});

// Event delegation for delete button clicks
document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('delete-button')) {
      const iconElement = event.target;
      const foodItem = iconElement.closest('.food-item');

      if (foodItem) {
          const itemId = foodItem.getAttribute('data-item-id');
          const currentTab = foodItem.getAttribute('data-tab');
          console.log('Deleting item:', itemId, 'from tab:', currentTab); // Check values here

          // Call function to remove item
          await removeFoodItem(itemId, currentTab);
      }
  }
});

async function fetchFoodItems(currentTab) {
  try {
      const response = await fetch(`http://localhost:3000/fetchfoodItems?tab=${currentTab}`);
      if (!response.ok) {
          throw new Error('Failed to fetch food items');
      }
  } catch (error) {
      console.error('Error fetching food items:', error);
      // Handle error, possibly show user-friendly message
  }
}
// ======================= Search Bar  =======================
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content-item');
  let currentTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');

  // Function to handle tab switching and save tab data
  const tab_Nav = function(tabBtnClick) {
    const tabName = tabButtons[tabBtnClick].getAttribute('data-tab'); // Get the data-tab attribute value
    saveTabData(tabBtnClick, tabName); // Call function to save tab data
  }
  
  // Handle tab switching
  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        currentTab = button.getAttribute('data-tab');
        document.getElementById(currentTab).classList.add('active');

        // Call tab_Nav function to save tab data to the database
        tab_Nav(index);

        fetchFoodItems(currentTab);
    });
  });

  const resultsBox = document.querySelector(".result-box");
  const inputBox = document.getElementById("input-box");
  
  inputBox.addEventListener('keyup', () => {
      let input = inputBox.value.trim().toLowerCase();
      if (input.length) {
          // Clear results box and show a loading state
          resultsBox.innerHTML = '<div class="loading">Loading...</div>';
          resultsBox.style.display = 'block';

          fetch(`http://localhost:3000/nutrition?query=${encodeURIComponent(input)}`)
              .then(response => response.json())
              .then(data => {
                  let apiResults = data.items.map(item => ({
                      name: titleCase(item.name),
                      calories: item.calories !== undefined ? item.calories.toFixed(2) : 'N/A',
                      servingSize: item.serving_size_g !== undefined ? item.serving_size_g + 'g' : 'N/A',
                      carbs: item.carbohydrates_total_g !== undefined ? item.carbohydrates_total_g + 'g' : 'N/A',
                      protein: item.protein_g !== undefined ? item.protein_g + 'g' : 'N/A',
                      fat: item.fat_total_g !== undefined ? item.fat_total_g + 'g' : 'N/A'
                  }));
                  display(apiResults);
              });
      } else {
          resultsBox.innerHTML = '';
          resultsBox.style.display = 'none';
      }
  });

  function titleCase(str) {
      return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  function display(results) {
      if (results.length === 0) {
          resultsBox.innerHTML = '<div class="no-results">No results found</div>';
      } else {
          const content = results.map(item => {
              return `
                  <li onclick="selectInput(this)" data-item='${JSON.stringify(item)}'>
                      <div class="food-name">${item.name}</div>
                      <div class="nutrients">
                          ${item.calories !== 'N/A' ? `<i class="fa-solid fa-fire"></i> ${item.calories} cal` : ''}
                          ${item.servingSize ? ` &nbsp; &bull; &nbsp; Serving Size: ${item.servingSize}` : ''} 
                      </div>
                      <div class="add-button" onclick="addItemToList('${item.name}', ${item.calories})">
                        <i class="fa-solid fa-circle-plus"></i>
                      </div>
                  </li>
              `;
          }).join('');

          resultsBox.innerHTML = "<ul>" + content + "</ul>";
      }
  }

  window.selectInput = function(listItem) {
      const foodItem = JSON.parse(listItem.getAttribute('data-item'));
      addFoodToTab(foodItem);
      resultsBox.innerHTML = '';
      resultsBox.style.display = 'none';
  };

  async function addFoodToTab(item) {
    try {
      // Make a POST request to save the food item and get back the generated itemId
      const response = await fetch('http://localhost:3000/food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tabName: currentTab,
          name: item.name,
          calories: item.calories,
          servingSize: item.servingSize,
          carbs: item.carbs,
          protein: item.protein,
          fat: item.fat,
          quantity: item.quantity || 1,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add food item');
      }
  
      const responseData = await response.json();
      const itemId = responseData.id;
  
      const foodHtml = `
        <div class="food-item" data-item-id="${itemId}" data-tab="${currentTab}" data-calories="${item.calories}" data-carbs="${item.carbs}" data-protein="${item.protein}" data-fat="${item.fat}" data-serving-size="${item.servingSize}">
          <div class="food-info">
            <div class="food-name">${item.name}</div>
            <div class="nutrients">
              ${item.calories !== 'N/A' ? `<i class="fa-solid fa-fire"></i> <span class="calories">${item.calories}</span> cal` : ''}
              ${item.servingSize ? `&nbsp; &bull; &nbsp; Serving Size: <span class="serving-size">${item.servingSize}</span>` : ''}
            </div>
            <div class="nutrients2">
              ${item.carbs !== 'N/A' ? `<strong style="color: black;">Carbs:</strong> <span class="carbs">${item.carbs}</span>` : ''}
              ${item.protein ? `&nbsp; &vert; &nbsp; <strong style="color: black;">Protein:</strong> <span class="protein">${item.protein}</span>` : ''}
              ${item.fat ? `&nbsp; &vert; &nbsp; <strong style="color: black;">Fat:</strong> <span class="fat">${item.fat}</span>` : ''}
              <button class="delete-button" data-item-id="${itemId}" data-tab="${currentTab}"></button>
            </div>
            <div class="counter">
              <button class="decrement">-</button>
              <div id="count" data-item-id="${itemId}" data-tab="${currentTab}">${item.quantity || 1}</div>
              <button class="increment">+</button>
            </div>
          </div>
        </div>
      `;
  
      const foodContainer = document.createElement('div');
      foodContainer.innerHTML = foodHtml;
  
      const tabContent = document.getElementById(currentTab);
      tabContent.appendChild(foodContainer);
  
      alert(`Food item added successfully for ${currentTab}!`);
    } catch (error) {
      console.error('Error adding food item:', error);
      alert('Error adding food item');
    }
  }
  
  // Event listeners for increment and decrement buttons
  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('increment') || event.target.classList.contains('decrement')) {
      const counterDiv = event.target.parentElement.querySelector('#count');
      const itemId = counterDiv.getAttribute('data-item-id');
      const currentTab = counterDiv.getAttribute('data-tab');
      let currentCount = parseInt(counterDiv.textContent);
  
      if (event.target.classList.contains('increment')) {
        currentCount += 1;
      } else if (event.target.classList.contains('decrement') && currentCount > 0) {
        currentCount -= 1;
      }
  
      counterDiv.textContent = currentCount;
  
      if (currentCount === 0) {
        const confirmDelete = confirm("Quantity is zero. Do you want to delete this item?");
        if (confirmDelete) {
          removeFoodItem(itemId, currentTab);
        } else {
          counterDiv.textContent = currentCount + 1;
        }
      } else {
        const foodItem = event.target.closest('.food-item');
        updateQuantity(itemId, currentTab, currentCount, foodItem);
        updateNutrients(foodItem, currentCount);
      }
    }
  });
  
  // Update nutrients in UI
  function updateNutrients(foodItem, quantity) {
    const baseCalories = parseFloat(foodItem.getAttribute('data-calories'));
    const baseCarbs = parseFloat(foodItem.getAttribute('data-carbs'));
    const baseProtein = parseFloat(foodItem.getAttribute('data-protein'));
    const baseFat = parseFloat(foodItem.getAttribute('data-fat'));
    const baseServingSize = foodItem.getAttribute('data-serving-size');
  
    const calories = (baseCalories * quantity).toFixed(2);
    const carbs = (baseCarbs * quantity).toFixed(2);
    const protein = (baseProtein * quantity).toFixed(2);
    const fat = (baseFat * quantity).toFixed(2);
    const servingSize = baseServingSize ? `${parseFloat(baseServingSize) * quantity}g` : 'N/A';
  
    foodItem.querySelector('.calories').textContent = calories;
    foodItem.querySelector('.carbs').textContent = carbs;
    foodItem.querySelector('.protein').textContent = protein;
    foodItem.querySelector('.fat').textContent = fat;
    foodItem.querySelector('.serving-size').textContent = servingSize;
  }

  // Update nutrients in database
  async function updateQuantity(itemId, currentTab, quantity, foodItem) {
    try {
      const baseCalories = parseFloat(foodItem.getAttribute('data-calories'));
      const baseCarbs = parseFloat(foodItem.getAttribute('data-carbs'));
      const baseProtein = parseFloat(foodItem.getAttribute('data-protein'));
      const baseFat = parseFloat(foodItem.getAttribute('data-fat'));
      const baseServingSize = parseFloat(foodItem.getAttribute('data-serving-size'));
  
      const calories = (baseCalories * quantity).toFixed(2);
      const carbs = (baseCarbs * quantity).toFixed(2);
      const protein = (baseProtein * quantity).toFixed(2);
      const fat = (baseFat * quantity).toFixed(2);
      const servingSize = baseServingSize ? `${baseServingSize * quantity}g` : 'N/A';
  
      const response = await fetch(`http://localhost:3000/food/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity,
          tabName: currentTab,
          calories,
          carbs,
          protein,
          fat,
          servingSize
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update food item quantity');
      }
    } catch (error) {
      console.error('Error updating food item quantity:', error);
    }
  }
  
});  

// ======================= Calendar  =======================
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper "),
  addEventCloseBtn = document.querySelector(".close "),
  addEventTitle = document.querySelector(".event-name "),
  addEventFrom = document.querySelector(".event-time-from "),
  addEventTo = document.querySelector(".event-time-to "),
  addEventSubmit = document.querySelector(".add-event-btn ");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const eventsArr = [];
getEvents();
console.log(eventsArr);

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    //check if event is present on that day
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

//function to add month and year on prev and next button
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day afte month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  console.log("here");
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}

//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//function update events when a day is active
function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((event) => {
        events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`;
      });
    }
  });
}

function defineProperty() {
  var osccred = document.createElement("div");
  osccred.style.position = "absolute";
  osccred.style.bottom = "0";
  osccred.style.right = "0";
  osccred.style.fontSize = "10px";
  osccred.style.color = "#ccc";
  osccred.style.fontFamily = "sans-serif";
  osccred.style.padding = "5px";
  osccred.style.background = "#fff";
  osccred.style.borderTopLeftRadius = "5px";
  osccred.style.borderBottomRightRadius = "5px";
  osccred.style.boxShadow = "0 0 5px #ccc";
  document.body.appendChild(osccred);
}

defineProperty();

//function to save events in local storage
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

//function to get events from local storage
function getEvents() {
  //check if events are already saved in local storage then return event else nothing
  if (localStorage.getItem("events") === null) {
    return;
  }
  eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}

function convertTime(time) {
  //convert time to 24 hour format
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}

document.addEventListener('DOMContentLoaded', function() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
      // Change the SIGN UP/LOGIN text to the user's name
      const dropbtn = document.querySelector('.dropbtn');
      dropbtn.textContent = user.name;

      // Hide Login button
      const loginLink = document.getElementById('login-link')
      // Show logout button
      const logoutButton = document.getElementById('logout-button');
      if (loginLink && logoutButton) {
          loginLink.style.display = 'none'
          logoutButton.style.display = 'block';
      }
  } else {
      // Hide logout button if user is not logged in and show login link when logged out
      const loginLink = document.getElementById('login-link')
      const logoutButton = document.getElementById('logout-button');
      if (loginLink && logoutButton) {
          loginLink.style.display = 'block'
          logoutButton.style.display = 'none';
      }
  }
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton){
      logoutButton.addEventListener('click', function() {
          // Clear user data from localStorage
          localStorage.removeItem('user');

          // Redirect to the login page
          window.location.href = '../../login.html';
      });
  }
});