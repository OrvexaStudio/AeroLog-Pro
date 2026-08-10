const content = document.querySelector("main");


// NAVIGAZIONE

function changePage(page){

    content.style.opacity = "0";

    setTimeout(()=>{

       switch(page){

    case "home":
        loadHome();
        break;


    case "logbook":
        loadLogbook();
        break;


    case "new":
        loadNewFlight();
        break;


    case "calendar":
        loadCalendar();
        break;

               case "checklist":
    loadChecklist();
    break;

    case "stats":
        loadStats();
        break;

}

        content.style.opacity = "1";

    },200);

}



// HOME

function loadHome(){

    let stats = getFlightStats();
    let todayFlights = getTodayPlannedFlights();
    let completedToday = getTodayCompletedFlights();

    content.innerHTML = `

    <section class="hero">

    <p class="label">
    TOTAL FLIGHT TIME
    </p>

    <h2>${stats.time}</h2>


    <div class="flight-line"></div>


    <div class="quick-data">

    <div>
    <span>FLIGHTS</span>
    <strong>${stats.flights}</strong>
    </div>


    <div>
    <span>AIRCRAFT</span>
    <strong>${stats.aircraft}</strong>
    </div>


    <div>
    <span>AIRPORTS</span>
    <strong>${stats.airports}</strong>
    </div>


    </div>

    </section>

${
completedToday.length > 0 ?

`

<section class="recent">

<p class="label">
TODAY FLIGHTS
</p>


${completedToday.map(flight=>`

<div class="flight-card"
onclick="openFlightDetails(${flight.id})">


<div>

<strong>
${flight.flightNumber || "FR----"}
</strong>


<p>
${flight.aircraft}
</p>


<p>
${flight.departure}
→
${flight.arrival}
</p>


</div>


<div class="time">

${flight.duration || "--"}

</div>


</div>


`).join("")}


</section>

`

:

""
}


    <section class="recent">

    <p class="label">
    LAST FLIGHT
    </p>


    <div class="flight-card">

    <strong>
    ${stats.flights > 0 
    ? "Flight recorded"
    : "No flights recorded"}
    </strong>

    </div>

    </section>

    ${
todayFlights.length > 0 ?

`

<section class="recent">

<p class="label">
TODAY PROGRAMMED FLIGHTS
</p>


${todayFlights.map(flight=>`

<div class="flight-card clickable"
onclick="openFlightDetails(${flight.id})">

<div>

<strong>
${flight.flightNumber || "FR----"}
</strong>


<p>
${flight.aircraft}
</p>


<p>
${flight.departure}
→
${flight.arrival}
</p>


</div>



<button class="complete-btn" onclick="confirmPlannedFlight(${flight.id})">
EFFETTUATO
</button>


<button class="cancel-btn" onclick="rejectPlannedFlight(${flight.id})">
NON EFFETTUATO
</button>


</div>


`).join("")}


</section>

`

:
""
}

    `;

}



// LOGBOOK

function loadLogbook(){

    let flights =
    JSON.parse(localStorage.getItem("aerolog_flights")) || [];


    let list = "";


    flights.slice().reverse().forEach(flight=>{


        list += `

<div class="flight-card">


<div onclick="openFlightDetails(${flight.id})">

       <strong>
${flight.flightNumber || "FR----"}
</strong>


<p>
${flight.aircraft}
</p>


        <p>
        ${flight.departure} → ${flight.arrival}
        </p>


       <p>
${flight.type} | ${flight.date}
</p>




        </div>


        <div class="time">

        ${flight.duration}

        </div>


        <div class="actions">

        <button onclick="editFlight(${flight.id})">
        EDIT
        </button>


        <button onclick="deleteFlight(${flight.id})">
        DELETE
        </button>


        </div>


        </div>

        `;


    });



    if(list===""){

        list=`

        <div class="flight-card">

        No flight history

        </div>

        `;

    }



    content.innerHTML = `

    <section class="hero">

    <p class="label">
    FLIGHT LOGBOOK
    </p>

    <h2>${flights.length}</h2>

    <p>
    Recorded flights
    </p>

    </section>


<input 
id="search-logbook"
placeholder="Search flights..."
oninput="searchLogbook()">


<section class="recent" id="logbook-list">

${list}

</section>

    `;

}



// NUOVO VOLO

function loadNewFlight(){


content.innerHTML = `

<section class="hero">

<p class="label">
NEW FLIGHT
</p>


<select id="aircraft">

<option value="">
Select Aircraft
</option>


<option>
Boeing 737 MAX 8
</option>


<option>
Boeing 747-400
</option>


</select>



<input 
id="flight-date"
type="date">



<input 
id="departure"
placeholder="Departure ICAO">



<input 
id="arrival"
placeholder="Arrival ICAO">


<input 
id="duration"
placeholder="HH:MM"
maxlength="5"
inputmode="numeric"
oninput="formatTime(this)">



<select id="flight-type">

<option>
IFR
</option>


<option>
VFR
</option>


</select>


<input
id="route"
placeholder="Route (optional)">


<textarea
id="metar-departure"
placeholder="METAR Departure (optional)">
</textarea>


<textarea
id="metar-arrival"
placeholder="METAR Arrival (optional)">
</textarea>


<textarea
id="notes"
placeholder="Flight Notes">
</textarea>



<button class="save" onclick="saveFlight()">

SAVE FLIGHT

</button>


</section>

`;

}



// SALVA VOLO

function saveFlight(){


let flight = {

id: Date.now(),
    flightId: Date.now(),

    flightNumber:
generateFlightNumber(),

aircraft:
document.getElementById("aircraft").value,


departure:
document.getElementById("departure").value.toUpperCase(),


arrival:
document.getElementById("arrival").value.toUpperCase(),


duration:
document.getElementById("duration").value,


type:
document.getElementById("flight-type").value,


notes:
document.getElementById("notes").value,

route:
document.getElementById("route").value,

metarDeparture:
document.getElementById("metar-departure").value,


metarArrival:
document.getElementById("metar-arrival").value,


date:
formatDate(document.getElementById("flight-date").value)

};



if(
!flight.aircraft ||
!flight.departure ||
!flight.arrival 

){

alert("Complete all flight data");
return;

}



let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];


flights.push(flight);



localStorage.setItem(
"aerolog_flights",
JSON.stringify(flights)
);



changePage("logbook");


}



// ELIMINA VOLO
function deleteFlight(id){


let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];



let deletedFlight =
flights.find(f => f.id === id);



flights =
flights.filter(
flight => flight.id !== id
);



localStorage.setItem(
"aerolog_flights",
JSON.stringify(flights)
);



if(deletedFlight){


let planned =
JSON.parse(localStorage.getItem("aerolog_planned")) || [];



planned =
planned.filter(
flight =>
flight.flightId !== deletedFlight.flightId
);



localStorage.setItem(
"aerolog_planned",
JSON.stringify(planned)
);


}



loadLogbook();


}


// MODIFICA VOLO

function editFlight(id){


let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];


let flight =
flights.find(f=>f.id===id);



content.innerHTML = `

<section class="hero">

<p class="label">
EDIT FLIGHT
</p>


<select id="aircraft">

<option>
${flight.aircraft}
</option>

<option>
Boeing 737 MAX 8
</option>

<option>
Boeing 747-400
</option>

</select>


<input id="departure" value="${flight.departure}">


<input id="arrival" value="${flight.arrival}">


<input id="duration" value="${flight.duration}">
<input 
id="route"
value="${flight.route || ""}"
placeholder="Route (optional)">


<select id="flight-type">

<option>
${flight.type}
</option>

<option>
IFR
</option>

<option>
VFR
</option>

</select>

<textarea
id="metar-departure"
placeholder="METAR Departure (optional)">${flight.metarDeparture || ""}</textarea>


<textarea
id="metar-arrival"
placeholder="METAR Arrival (optional)">${flight.metarArrival || ""}</textarea>


<textarea
id="notes"
placeholder="Notes">${flight.notes || ""}</textarea>

<button class="save" onclick="updateFlight(${id})">

SAVE CHANGES

</button>


</section>

`;

}



// AGGIORNA VOLO

function updateFlight(id){


let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];


let flight =
flights.find(f=>f.id===id);



flight.aircraft =
document.getElementById("aircraft").value;


flight.departure =
document.getElementById("departure").value.toUpperCase();


flight.arrival =
document.getElementById("arrival").value.toUpperCase();


flight.duration =
document.getElementById("duration").value;

flight.route =
document.getElementById("route").value;


flight.metarDeparture =
document.getElementById("metar-departure").value;


flight.metarArrival =
document.getElementById("metar-arrival").value;


flight.notes =
document.getElementById("notes").value;

flight.type =
document.getElementById("flight-type").value;



localStorage.setItem(
"aerolog_flights",
JSON.stringify(flights)
);



loadLogbook();

}



// STATISTICHE

function loadStats(){


let stats = getFlightStats();
    let advanced = getAdvancedStats();
let routes = getRouteStats();

let fleet = getFleetStats();


let fleetHTML = "";



Object.keys(fleet).forEach(type=>{


fleetHTML += `

<div class="flight-card">


<div>

<strong>
${type}
</strong>


<p>
Flights: ${fleet[type].flights}
</p>


</div>



<div class="time">

${fleet[type].time}

</div>



</div>


`;



});



content.innerHTML = `


<section class="hero">


<p class="label">
STATISTICS
</p>



<div class="quick-data">


<div>

<span>TOTAL TIME</span>

<strong>
${stats.time}
</strong>

</div>



<div>

<span>FLIGHTS</span>

<strong>
${stats.flights}
</strong>

</div>



</div>


</section>

<section class="recent">


<p class="label">
PILOT STATISTICS
</p>



<div class="flight-card">

<div>

<strong>
Average Flight
</strong>

</div>


<div class="time">
${advanced.average}
</div>


</div>



<div class="flight-card">

<div>

<strong>
Longest Flight
</strong>

</div>


<div class="time">
${advanced.longest}
</div>


</div>



<div class="flight-card">

<div>

<strong>
IFR Time
</strong>

</div>


<div class="time">
${advanced.ifr}
</div>


</div>



<div class="flight-card">

<div>

<strong>
VFR Time
</strong>

</div>


<div class="time">
${advanced.vfr}
</div>


</div>


</section>

<section class="recent">


<p class="label">
FLEET TIME
</p>


${fleetHTML}

<section class="recent">


<p class="label">
TOP ROUTES
</p>


${
routes.length > 0

?

routes.map(route=>`

<div class="flight-card">


<div>

<strong>
${route[0]}
</strong>


<p>
Flights: ${route[1]}
</p>


</div>


</div>


`).join("")

:

`
<div class="flight-card">
No routes recorded
</div>
`

}


</section>

</section>

<section class="recent">


<p class="label">
DATABASE
</p>


<div class="flight-card">

<div>

<strong>
BACKUP SYSTEM
</strong>


<p>
Save or restore your flight data
</p>


</div>


</div>


<button class="save" onclick="exportBackup()">

EXPORT BACKUP

</button>


<button class="save" onclick="document.getElementById('importFile').click()">

IMPORT BACKUP

</button>


<input 
type="file"
id="importFile"
accept=".json"
style="display:none"
onchange="importBackup(event)">


</section>

`;

}



// CALCOLO DATI

function getFlightStats(){


let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];


let minutes = 0;

let aircraft=[];

let airports=[];


flights.forEach(flight=>{


if(
flight.duration &&
flight.duration.includes(":")
){


let time =
flight.duration.split(":");


let hours =
parseInt(time[0]);


let minutesPart =
parseInt(time[1]);



if(
!isNaN(hours) &&
!isNaN(minutesPart)
){


minutes +=
hours * 60 +
minutesPart;


}

}



if(!aircraft.includes(flight.aircraft))
aircraft.push(flight.aircraft);



if(!airports.includes(flight.departure))
airports.push(flight.departure);



if(!airports.includes(flight.arrival))
airports.push(flight.arrival);



});



return {

time:
Math.floor(minutes/60)+"h "+
(minutes%60)+"m",

flights:
flights.length,

aircraft:
aircraft.length,

airports:
airports.length

};


}

function getRouteStats(){


let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];


let routes = {};



flights.forEach(flight=>{


let route =
flight.departure + " → " + flight.arrival;



if(!routes[route]){

routes[route] = 0;

}



routes[route]++;



});



return Object.entries(routes)
.sort((a,b)=>b[1]-a[1])
.slice(0,5);


}


function getFleetStats(){


let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];



let fleet = {};



flights.forEach(flight=>{


if(!fleet[flight.aircraft]){


fleet[flight.aircraft]={

minutes:0,

flights:0

};


}

    function getAdvancedStats(){


let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];


let totalMinutes = 0;

let ifrMinutes = 0;

let vfrMinutes = 0;

let longest = 0;



flights.forEach(flight=>{


let time =
flight.duration.split(":");


let minutes =
parseInt(time[0])*60 +
parseInt(time[1]);



totalMinutes += minutes;



if(minutes > longest){

longest = minutes;

}



if(flight.type === "IFR"){

ifrMinutes += minutes;

}


if(flight.type === "VFR"){

vfrMinutes += minutes;

}



});



function format(minutes){


let h =
Math.floor(minutes/60);


let m =
minutes%60;


return `${h}h ${m}m`;

}



return {


average:

flights.length
?
format(Math.floor(totalMinutes / flights.length))
:
"0h 0m",



longest:
format(longest),



ifr:
format(ifrMinutes),



vfr:
format(vfrMinutes)



};


}


let time =
flight.duration.split(":");



fleet[flight.aircraft].minutes +=
parseInt(time[0])*60 +
parseInt(time[1]);



fleet[flight.aircraft].flights++;



});




Object.keys(fleet).forEach(type=>{


let hours =
Math.floor(
fleet[type].minutes / 60
);



let mins =
fleet[type].minutes % 60;



fleet[type].time =
`${hours}h ${mins}m`;



});



return fleet;


}


// AVVIO APP

loadHome();

function formatTime(input){

let value = input.value.replace(/\D/g,"");


if(value.length > 4){

value = value.substring(0,4);

}


if(value.length >= 3){

value =
value.substring(0,2)
+
":"
+
value.substring(2);

}


input.value = value;

}

function formatDate(date){


if(!date) return "";


let parts = date.split("-");


return parts[2] + "/" + parts[1] + "/" + parts[0];


}

let calendarDate = new Date();


function loadCalendar(){


let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];

let planned =
JSON.parse(localStorage.getItem("aerolog_planned")) || [];

let month = calendarDate.getMonth();

let year = calendarDate.getFullYear();



let monthName =
calendarDate.toLocaleString(
"it-IT",
{
month:"long"
}
);



let firstDay =
new Date(year, month, 1).getDay();



let days =
new Date(year, month + 1, 0).getDate();



let flightDays = {};
    let plannedDays = {};

planned.forEach(flight=>{


let parts = flight.date.split("/");


if(parts.length===3){


let day = parseInt(parts[0]);


let month = parseInt(parts[1])-1;


let year = parseInt(parts[2]);



if(month === calendarDate.getMonth()
&& year === calendarDate.getFullYear()){


plannedDays[day]=true;


}

}


});



flights.forEach(flight=>{


let parts =
flight.date.split("/");


if(parts.length === 3){


let day = parseInt(parts[0]);

let fMonth = parseInt(parts[1])-1;

let fYear = parseInt(parts[2]);



if(fMonth === month && fYear === year){


flightDays[day] = true;


}


}


});



let calendar = "";



let empty =
firstDay === 0 ? 6 : firstDay - 1;



for(let i=0;i<empty;i++){

calendar += `

<div class="calendar-day empty"></div>

`;

}



for(let d=1; d<=days; d++){


calendar += `

<div 
class="calendar-day ${flightDays[d] ? "has-flight":""}"
onclick="showDayFlights(${d})">


<strong>
${d}
</strong>


${
flightDays[d]
?
"<span>✈</span>"
:
plannedDays[d]
?
"<span>◇</span>"
:
""
}


</div>

`;

}



content.innerHTML = `


<section class="hero">


<p class="label">
FLIGHT CALENDAR
</p>


<div class="calendar-header">


<button onclick="changeMonth(-1)">
◀
</button>


<h2>
${monthName}
${year}
</h2>


<button onclick="changeMonth(1)">
▶
</button>


</div>



<div class="calendar">


<div class="week">

<span>LUN</span>
<span>MAR</span>
<span>MER</span>
<span>GIO</span>
<span>VEN</span>
<span>SAB</span>
<span>DOM</span>

</div>


<div class="calendar-grid">

${calendar}

</div>


</div>


</section>


<section id="day-flights"></section>


`;

}

function getAdvancedStats(){


let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];


let totalMinutes = 0;

let ifrMinutes = 0;

let vfrMinutes = 0;

let longest = 0;



flights.forEach(flight=>{


let parts = flight.duration.split(":");


let minutes =
parseInt(parts[0]) * 60 +
parseInt(parts[1]);



totalMinutes += minutes;



if(minutes > longest){

longest = minutes;

}



if(flight.type === "IFR"){

ifrMinutes += minutes;

}



if(flight.type === "VFR"){

vfrMinutes += minutes;

}



});



function formatTime(minutes){


let hours = Math.floor(minutes / 60);

let mins = minutes % 60;


return `${hours}h ${mins}m`;

}



return {


average:

flights.length > 0

?

formatTime(
Math.floor(totalMinutes / flights.length)
)

:

"0h 0m",



longest:

formatTime(longest),



ifr:

formatTime(ifrMinutes),



vfr:

formatTime(vfrMinutes)


};


}

function exportBackup(){


let flights =
localStorage.getItem("aerolog_flights");


if(!flights){

alert("No flight data");

return;

}



let blob =
new Blob(
[flights],
{
type:"application/json"
}
);



let url =
URL.createObjectURL(blob);



let a =
document.createElement("a");


a.href=url;


a.download="aerolog_backup.json";


a.click();



URL.revokeObjectURL(url);


}

function importBackup(event){


let file =
event.target.files[0];


if(!file) return;



let reader =
new FileReader();



reader.onload=function(e){


try{


let data =
JSON.parse(e.target.result);



if(!Array.isArray(data)){

alert("Invalid backup");

return;

}



localStorage.setItem(
"aerolog_flights",
JSON.stringify(data)
);



alert("Backup imported successfully");


loadStats();



}

catch{


alert("Backup file not valid");


}


};



reader.readAsText(file);


}

function changeMonth(value){


calendarDate.setMonth(
calendarDate.getMonth()+value
);


loadCalendar();


}

function showDayFlights(day){


let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];


let planned =
JSON.parse(localStorage.getItem("aerolog_planned")) || [];



let month =
calendarDate.getMonth()+1;


let year =
calendarDate.getFullYear();



let date =
String(day).padStart(2,"0")
+
"/"
+
String(month).padStart(2,"0")
+
"/"
+
year;



let selectedFlights =
flights.filter(
flight=>flight.date === date
);



let selectedPlanned =
planned.filter(
flight=>flight.date === date
);



let box =
document.getElementById("day-flights");



if(!box) return;



box.innerHTML = `


<section class="recent">


<p class="label">
${date}
</p>



${selectedFlights.map(flight=>`


<div 
class="flight-card clickable"
onclick="openFlightDetails(${flight.id})">


<div>

<strong>
✈ COMPLETED
</strong>


<p>
${flight.aircraft}
</p>


<p>
${flight.departure} → ${flight.arrival}
</p>


<p>
${flight.duration}
</p>


</div>


</div>


`).join("")}



${selectedPlanned.map(flight=>`

<div 
class="flight-card clickable"
onclick="openFlightDetails(${flight.id})">

<div class="detail-row">

<span>FLIGHT</span>

<strong>
${flight.flightNumber || "FR----"}
</strong>

</div>


<div class="detail-row">

<span>AIRCRAFT</span>

<strong>
${flight.aircraft}
</strong>

</div>


<div class="detail-row">

<span>ROUTE</span>

<strong>
${flight.departure} → ${flight.arrival}
</strong>

</div>


<div class="detail-row">

<span>TIME</span>

<strong>
${flight.duration || "--"}
</strong>

</div>

</div>

`).join("")}




<button 
class="save"
onclick="openProgramFlight('${date}')">

+ PROGRAM NEW FLIGHT

</button>



</section>

`;

}

function savePlannedFlight(){


let flight = {


id: Date.now(),

flightNumber: generateFlightNumber(),


aircraft:
document.getElementById("planned-aircraft").value,


date:
document.getElementById("planned-date").value,


departure:
document.getElementById("planned-departure").value.toUpperCase(),


arrival:
document.getElementById("planned-arrival").value.toUpperCase(),


duration:
document.getElementById("planned-duration").value,

route:
document.getElementById("planned-route").value,


metarDeparture:
document.getElementById("planned-metar-departure").value,


metarArrival:
document.getElementById("planned-metar-arrival").value,

notes:
document.getElementById("planned-notes").value


};



if(
!flight.aircraft ||
!flight.date ||
!flight.departure ||
!flight.arrival
){

alert("Complete flight data");

return;

}



let planned =
JSON.parse(localStorage.getItem("aerolog_planned")) || [];



planned.push(flight);



localStorage.setItem(
"aerolog_planned",
JSON.stringify(planned)
);



loadCalendar();


}

function openProgramFlight(date){


let box =
document.getElementById("day-flights");



box.innerHTML = `


<section class="recent">


<p class="label">
PROGRAM FLIGHT
</p>



<input 
id="planned-date"
value="${date}"
readonly>


<select id="planned-aircraft">

<option>
Boeing 737 MAX 8
</option>


<option>
Boeing 747-400
</option>


</select>



<input
id="planned-departure"
placeholder="Departure ICAO">



<input
id="planned-arrival"
placeholder="Arrival ICAO">

<input
id="planned-route"
placeholder="Route (optional)">


<input
id="planned-metar-departure"
placeholder="METAR Departure (optional)">


<input
id="planned-metar-arrival"
placeholder="METAR Arrival (optional)">

<input
id="planned-duration"
placeholder="HH:MM"
maxlength="5"
oninput="formatFlightTime(this)">



<textarea
id="planned-notes"
placeholder="Notes">
</textarea>



<button 
class="save"
onclick="savePlannedFlight()">

SAVE PROGRAM

</button>


</section>


`;

}

function formatFlightTime(input){

let value = input.value.replace(/\D/g,"");


if(value.length > 4){
value = value.substring(0,4);
}


if(value.length >= 3){

value =
value.substring(0,2)
+
":"
+
value.substring(2);

}


input.value = value;

}

function generateFlightNumber(){

let number =
Math.floor(
1000 + Math.random() * 9000
);


return "FR" + number;

}

function getTodayPlannedFlights(){


let planned =
JSON.parse(localStorage.getItem("aerolog_planned")) || [];



let today =
new Date().toLocaleDateString();



return planned.filter(
flight => flight.date === today
);


}

function confirmPlannedFlight(id){


let planned =
JSON.parse(localStorage.getItem("aerolog_planned")) || [];



let flight =
planned.find(
f=>f.id===id
);



if(!flight)return;



let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];



flight.date =
new Date().toLocaleDateString();



flights.push(flight);



localStorage.setItem(
"aerolog_flights",
JSON.stringify(flights)
);



planned =
planned.filter(
f=>f.id!==id
);



localStorage.setItem(
"aerolog_planned",
JSON.stringify(planned)
);



loadHome();


}

function rejectPlannedFlight(id){


let planned =
JSON.parse(localStorage.getItem("aerolog_planned")) || [];



planned =
planned.filter(
f=>f.id!==id
);



localStorage.setItem(
"aerolog_planned",
JSON.stringify(planned)
);



loadHome();


}

function searchLogbook(){


let search =
document.getElementById("search-logbook").value
.toLowerCase();



let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];



let filtered =
flights.filter(flight=>{


return (

flight.flightNumber?.toLowerCase().includes(search)

||

flight.aircraft?.toLowerCase().includes(search)

||

flight.departure?.toLowerCase().includes(search)

||

flight.arrival?.toLowerCase().includes(search)

||

flight.type?.toLowerCase().includes(search)

||

flight.date?.toLowerCase().includes(search)

);


});



let list="";



filtered.reverse().forEach(flight=>{


list += `


<div class="flight-card">


<div>


<strong>
${flight.flightNumber || "FR----"}
</strong>


<p>
${flight.aircraft}
</p>


<p>
${flight.departure}
→
${flight.arrival}
</p>


<p>
${flight.type} | ${flight.date}
</p>


</div>


<div class="time">

${flight.duration}

</div>


</div>


`;


});



if(list===""){

list=`

<div class="flight-card">

No flights found

</div>

`;

}



document.getElementById("logbook-list").innerHTML = list;


}


function openFlightDetails(id){

let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];


let flight =
flights.find(f=>f.id===id);



if(!flight) return;



content.innerHTML = `


<section class="hero">

<p class="label">
FLIGHT DETAILS
</p>


<h2>
${flight.flightNumber || "FR----"}
</h2>


</section>



<section class="recent">


<div class="details-card">


<div class="detail-row">

<span>AIRCRAFT</span>

<strong>
${flight.aircraft || "-"}
</strong>

</div>



<div class="detail-row">

<span>ROUTE</span>

<strong>
${flight.departure || "-"} 
→ 
${flight.arrival || "-"}
</strong>

</div>



<div class="detail-row">

<span>FLIGHT TIME</span>

<strong>
${flight.duration || "--"}
</strong>

</div>



<div class="detail-row">

<span>TYPE</span>

<strong>
${flight.type || "-"}
</strong>

</div>



<div class="detail-row">

<span>DATE</span>

<strong>
${flight.date || "-"}
</strong>

</div>



<div class="detail-row">

<span>ROUTE</span>

<strong>
${flight.route || "Not inserted"}
</strong>

</div>



<div class="detail-row">

<span>METAR DEPARTURE</span>

<strong>
${flight.metarDeparture || "Not inserted"}
</strong>

</div>



<div class="detail-row">

<span>METAR ARRIVAL</span>

<strong>
${flight.metarArrival || "Not inserted"}
</strong>

</div>



<div class="detail-row">

<span>NOTES</span>

<strong>
${flight.notes || "No notes"}
</strong>

</div>


</div>


</section>


`;

}

function getTodayCompletedFlights(){

let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];


let today =
new Date().toLocaleDateString();


return flights.filter(
flight => flight.date === today
);

}

setTimeout(()=>{

document.getElementById("splash").style.opacity="0";


setTimeout(()=>{

document.getElementById("splash").remove();

},500);


},2000);

if("serviceWorker" in navigator){

navigator.serviceWorker.register(
"service-worker.js"
);

}



function openPlannedFlightDetails(id){

let planned =
JSON.parse(localStorage.getItem("aerolog_planned")) || [];


let flight =
planned.find(f=>f.id===id);


if(!flight) return;



content.innerHTML = `

<section class="hero">

<p class="label">
PROGRAMMED FLIGHT
</p>


<h2>
${flight.flightNumber || "FR----"}
</h2>


</section>


<section class="recent">


<div class="flight-card details-card">


<div class="detail-row">

<span>AIRCRAFT</span>

<strong>
${flight.aircraft}
</strong>

</div>


<div class="detail-row">

<span>ROUTE</span>

<strong>
${flight.departure} → ${flight.arrival}
</strong>

</div>


<div class="detail-row">

<span>FLIGHT ROUTE</span>

<strong>
${flight.route || "Not inserted"}
</strong>

</div>


<div class="detail-row">

<span>METAR DEPARTURE</span>

<strong>
${flight.metarDeparture || "Not inserted"}
</strong>

</div>


<div class="detail-row">

<span>METAR ARRIVAL</span>

<strong>
${flight.metarArrival || "Not inserted"}
</strong>

</div>


<div class="detail-row">

<span>DURATION</span>

<strong>
${flight.duration || "--"}
</strong>

</div>


<div class="detail-row">

<span>NOTES</span>

<strong>
${flight.notes || "No notes"}
</strong>

</div>


</div>


</section>

`;

}

let checklists = [

{
title:"PRE FLIGHT CHECKLIST",

sections:[

{
title:"",

items:[

{name:"PARKING BRAKE",value:"SET",done:false},
{name:"BATTERY",value:"GUARD CLOSED",done:false},
{name:"STANDBY POWER",value:"GUARD CLOSED",done:false},
{name:"L CENTER FUEL PUMP",value:"AS REQUIRED",done:false},
{name:"L AFT FUEL PUMP",value:"AS REQUIRED",done:false},
{name:"APU",value:"START",done:false},
{name:"APU GEN",value:"ON",done:false},
{name:"POS LIGHTS",value:"STEADY",done:false},
{name:"LOGO LIGHT",value:"AS REQUIRED",done:false},
{name:"CABIN LIGHTS",value:"AS REQUIRED",done:false},
{name:"EMER EXIT LIGHTS",value:"GUARD CLOSED",done:false},
{name:"PASSENGER SIGNS",value:"ON",done:false},
{name:"PACKS",value:"AUTO / HIGH",done:false},
{name:"IRS MODE SELECTORS",value:"OFF > NAV",done:false},
{name:"FMC",value:"SET",done:false}

]

},


{
title:"Request Flight-plan Clearance",

items:[

{name:"TRANSPONDER",value:"SET",done:false},
{name:"IAS / MACH SPEED",value:"SET",done:false},
{name:"HDG / TAKEOFF RWY",value:"SET",done:false},
{name:"INITIAL ALT",value:"SET",done:false},
{name:"YAW DAMPER",value:"ON",done:false},
{name:"WINDOW HEAT",value:"ON",done:false},
{name:"FLIGHT ALTITUDE",value:"SET",done:false},
{name:"LANDING ALTITUDE",value:"SET",done:false},
{name:"FLIGHT DIRECTORS",value:"ON",done:false},
{name:"LNAV",value:"AS REQUIRED",done:false},
{name:"VNAV",value:"AS REQUIRED",done:false},
{name:"MINIMUMS REF",value:"BARO or RADIO",done:false},
{name:"MINIMUMS",value:"SET",done:false},
{name:"ALTIMETER REF",value:"IN or HPA",done:false},
{name:"AUTO BRAKE",value:"RTO",done:false},
{name:"COM RADIOS",value:"SET",done:false},
{name:"DOORS",value:"CLOSED",done:false}

]

}

]

},


{
title:"BEFORE START CHECKLIST",

sections:[

{
title:"Request Pushback & Startup Clearance",

items:[

{
name:"AUTOTHROTTLE",
value:"ARM",
done:false
},

{
name:"L & R C FUEL PUMPS",
value:"AS REQUIRED",
done:false
},

{
name:"A & F FUEL PUMPS",
value:"ON",
done:false
},

{
name:"ELEC HYD PUMPS",
value:"ON",
done:false
},

{
name:"ANTI COLL LIGHT",
value:"ON",
done:false
},

{
name:"PARKING BRAKE",
value:"SET",
done:false
},

{
name:"GROUND EQUIPMENT",
value:"REMOVED",
done:false
},

{
name:"ENGINE AREA",
value:"CLEAR",
done:false
}

]

}

]

},


{
title:"ENGINE START CHECKLIST",

items:[

{
name:"SEC DISPLAY UNIT",
value:"ENGINE",
done:false
},

{
name:"PACKS",
value:"OFF",
done:false
},

{
name:"ENGINE 1 START SWITCH",
value:"GND",
done:false
},

{
name:"ENGINE 1 FUEL CONTROL LEVER",
value:"RUN",
done:false
},

{
name:"ENGINE 2 START SWITCH",
value:"GND",
done:false
},

{
name:"ENGINE 2 FUEL CONTROL LEVER",
value:"RUN",
done:false
}

]

},

{
title:"BEFORE TAXI CHECKLIST",

sections:[

{
title:"",

items:[

{
name:"GENERATORS 1 & 2",
value:"ON",
done:false
},

{
name:"PROBE HEAT",
value:"ON",
done:false
},

{
name:"WING ANTI ICE",
value:"AS REQUIRED",
done:false
},

{
name:"ENGINE ANTI ICE",
value:"AS REQUIRED",
done:false
},

{
name:"PACKS",
value:"AUTO",
done:false
},

{
name:"ISOLATION VALVE",
value:"AUTO",
done:false
},

{
name:"APU BLEED",
value:"OFF",
done:false
},

{
name:"APU",
value:"OFF",
done:false
},

{
name:"ENG START SWITCHES",
value:"CONT",
done:false
},

{
name:"FLAPS",
value:"AS REQUIRED",
done:false
},

{
name:"ELEVATOR TRIM",
value:"SET FOR TAKE-OFF",
done:false
},

{
name:"FLIGHT CONTROLS",
value:"FREE AND CORRECT",
done:false
},

{
name:"RECALL (737-800 only)",
value:"CHECK",
done:false
},

{
name:"LOWER DISPLAY UNIT (DU)",
value:"OFF",
done:false
}

]

},


{
title:"Request Taxi Clearance",

items:[

{
name:"TAXI LIGHTS",
value:"ON",
done:false
},

{
name:"RWY TURN-OFF LIGHTS",
value:"AS REQUIRED",
done:false
}

]

}

]

},

    {
title:"TAXI CHECKLIST",

items:[

{
name:"TAXI to assigned runway",
value:"SPEED Max. 20 knots",
done:false
},

{
name:"BRKS/GYRO/TURN COORDINATOR",
value:"CHECK during taxi",
done:false
}

]

},
{
title:"BEFORE TAKE-OFF CHECKLIST",

sections:[

{
title:"",

items:[

{
name:"PARKING BRAKE",
value:"SET",
done:false
},

{
name:"FUEL FLOW",
value:"RESET, then RATE",
done:false
},

{
name:"C FUEL PUMPS",
value:"AS REQUIRED",
done:false
},

{
name:"DE-ICE",
value:"AS REQUIRED",
done:false
},

{
name:"CABIN LIGHTS",
value:"AS REQUIRED",
done:false
},

{
name:"FLIGHT INSTRUMENTS",
value:"CHECK",
done:false
},

{
name:"ENGINE INSTRUMENTS",
value:"CHECK",
done:false
},

{
name:"TAKE-OFF DATA",
value:"(V1, VR, V2) CHECK",
done:false
},

{
name:"NAV EQUIPMENT",
value:"CHECK",
done:false
}

]

},


{
title:"Request Takeoff Clearance",

items:[

{
name:"LANDING LIGHTS",
value:"ON",
done:false
},

{
name:"STROBE LIGHT",
value:"ON",
done:false
},

{
name:"TAXI LIGHTS",
value:"OFF",
done:false
},

{
name:"TRANSPONDER",
value:"TA/RA",
done:false
},

{
name:"TFC",
value:"PUSH ON",
done:false
},

{
name:"CLOCK",
value:"START",
done:false
}

]

}

]

},

    {
title:"AFTER TAKE-OFF CHECKLIST",

items:[

{
name:"POSITIVE RATE OF CLIMB",
value:"GEAR UP",
done:false
},

{
name:"AUTO-BRAKE",
value:"OFF",
done:false
},

{
name:"ENGINE START SWITCHES",
value:"OFF",
done:false
},

{
name:"GEAR LEVER",
value:"OFF POSITION",
done:false
},

{
name:"RWY TURN-OFF LIGHTS",
value:"OFF",
done:false
},

{
name:"CABIN LIGHTS",
value:"AS REQUIRED",
done:false
}

]

},

    {
title:"CLIMB-OUT CHECKLIST",

sections:[

{
title:"",

items:[

{
name:"CMD A or B",
value:"ENGAGE (when suitable)",
done:false
}

]

},


{
title:"Passing TA (Transition-Altitude)",

items:[

{
name:"ALTIMETER",
value:"PUSH TO SET STD (29.92 / 1013)",
done:false
},

{
name:"BELOW 10'000FT",
value:"MAX. 250 KIAS",
done:false
},

{
name:"ATC",
value:"AS REQUIRED",
done:false
}

]

},


{
title:"Passing 10'000 ft",

items:[

{
name:"LANDING LIGHTS",
value:"OFF",
done:false
},

{
name:"FASTEN SEAT BELTS",
value:"OFF",
done:false
},

{
name:"C FUEL PUMPS",
value:"AS REQUIRED",
done:false
}

]

}

]

},

    {
title:"CRUISE & DESCENT PREPARATION CHECKLIST",

sections:[

{
title:"",

items:[

{
name:"ENGINE & INSTRUMENTS",
value:"MONITOR",
done:false
},

{
name:"FUEL QUANTITY",
value:"CHECK",
done:false
},

{
name:"LIGHTS",
value:"AS REQUIRED",
done:false
}

]

},


{
title:"Before TOD",

items:[

{
name:"ATIS / AIRPORT INFORMATION",
value:"CHECK",
done:false
},

{
name:"ALTIMETER",
value:"CHECK",
done:false
},

{
name:"RADIOS",
value:"SET",
done:false
},

{
name:"RESET MCP ALTITUDE",
value:"CHECK",
done:false
},

{
name:"FMC APPR SPEED REF",
value:"SET",
done:false
},

{
name:"LOCALIZER FREQ",
value:"SET",
done:false
},

{
name:"ILS LOC COURSE",
value:"SET",
done:false
}

]

},


{
title:"Descent",

items:[

{
name:"DE-ICE",
value:"AS REQUIRED",
done:false
},

{
name:"LANDING ALT",
value:"CHECK",
done:false
},

{
name:"RECALL (737-800 only)",
value:"CHECK",
done:false
},

{
name:"RADIO ALT / BARO MIN",
value:"SET, CHECK",
done:false
},

{
name:"AUTO BRAKE",
value:"AS REQUIRED",
done:false
}

]

},


{
title:"Passing TA (Transition-Altitude)",

items:[

{
name:"ALTIMETER",
value:"RESET TO LOCAL",
done:false
}

]

},


{
title:"Below 10'000 ft",

items:[

{
name:"SPEED",
value:"250 KIAS",
done:false
},

{
name:"LANDING LIGHTS",
value:"ON",
done:false
},

{
name:"PASSENGER SIGNS",
value:"ON",
done:false
}

]

},


{
title:"",

items:[

{
name:"Check Weather (ATIS, Flight Services)",
value:"",
done:false
}

]

}

]

},

    {
title:"APPROACH CHECKLIST",

sections:[

{
title:"",

items:[

{
name:"ALTIMETER",
value:"CHECK",
done:false
},

{
name:"LOCALIZER FREQ",
value:"CHECK",
done:false
},

{
name:"LOCALIZER COURSE",
value:"CHECK",
done:false
},

{
name:"APP",
value:"ARM",
done:false
},

{
name:"GLIDESLOPE ALIVE",
value:"GEAR DOWN",
done:false
},

{
name:"FLAPS",
value:"15",
done:false
},

{
name:"SPEED BRAKE",
value:"ARM",
done:false
},

{
name:"2ND AUTOPILOT",
value:"ARM (when ILS established)",
done:false
},

{
name:"ENGINE START SWITCHES",
value:"CONT",
done:false
},

{
name:"LANDING FLAPS",
value:"SET",
done:false
}

]

}

]

},

    {
title:"LANDING CHECKLIST",

sections:[

{
title:"",

items:[

{
name:"GO-AROUND ALTITUDE",
value:"SET",
done:false
},

{
name:"RWY TURN-OFF LIGHTS",
value:"ON",
done:false
},

{
name:"LANDING GEAR",
value:"CHECK DOWN",
done:false
},

{
name:"AUTOPILOT",
value:"AS REQUIRED",
done:false
},

{
name:"AUTO-THRUST",
value:"AS REQUIRED",
done:false
}

]

},


{
title:"After Touch-Down",

items:[

{
name:"THRUST REVERSE",
value:"ENGAGE",
done:false
},

{
name:"AUTOPILOT",
value:"OFF",
done:false
},

{
name:"AUTOTHRUST",
value:"OFF",
done:false
},

{
name:"AT 60 KTS",
value:"REV THRUST TO IDLE",
done:false
},

{
name:"AT 30 KTS",
value:"AUTO-BRAKE DISENGAGE",
done:false
}

]

}

]

},

    {
title:"AFTER LANDING CHECKLIST",

sections:[

{
title:"",

items:[

{
name:"TRANSPONDER",
value:"OFF",
done:false
},

{
name:"FLAPS",
value:"RETRACT",
done:false
},

{
name:"SPEED BRAKE",
value:"DOWN",
done:false
},

{
name:"LANDING LIGHTS",
value:"OFF",
done:false
},

{
name:"STROBE LIGHTS",
value:"OFF",
done:false
},

{
name:"TAXI LIGHTS",
value:"ON",
done:false
},

{
name:"CABIN LIGHTS",
value:"AS REQUIRED",
done:false
},

{
name:"ANTI ICE",
value:"AS REQUIRED",
done:false
},

{
name:"APU",
value:"START / CHECK RUN",
done:false
},

{
name:"PROBE HEAT",
value:"OFF",
done:false
},

{
name:"ENG START SWITCHES",
value:"OFF",
done:false
},

{
name:"AUTO-BRAKE",
value:"OFF",
done:false
}

]

},


{
title:"Taxi to Assigned Gate/Parking (Speed Max 20 knots)",

items:[

{
name:"RWY TURNOFF LIGHTS",
value:"OFF",
done:false
},

{
name:"APU GEN",
value:"ON / CHECK VOLTS",
done:false
}

]

},


{
title:"Turning Into The Gate:",

items:[

{
name:"TAXI LIGHTS",
value:"OFF",
done:false
}

]

}

]

},

    {
title:"PARKING / SHUTDOWN CHECKLIST",

sections:[

{
title:"",

items:[

{
name:"PARKING BRAKES",
value:"SET",
done:false
},

{
name:"ENGINE FUEL CONTROL LEVERS",
value:"OFF",
done:false
},

{
name:"GROUND CONTACT",
value:"ESTABLISH",
done:false
},

{
name:"GROUND OPERATIONS",
value:"AS REQUIRED (FMC)",
done:false
},

{
name:"PASSENGER SIGNS",
value:"OFF",
done:false
},

{
name:"APU BLEED AIR",
value:"ON",
done:false
},

{
name:"ANTI COLL LIGHT",
value:"OFF",
done:false
},

{
name:"FUELPUMPS",
value:"OFF",
done:false
},

{
name:"L AFT FUEL PUMP",
value:"ON",
done:false
},

{
name:"ANTI-ICE",
value:"OFF",
done:false
},

{
name:"ELEC HYD PUMPS",
value:"OFF",
done:false
},

{
name:"ISOLATION VALVE",
value:"OPEN",
done:false
},

{
name:"FLIGHT DIRECTOR",
value:"OFF",
done:false
},

{
name:"ELECTRICAL POWER",
value:"ESTABLISH",
done:false
},

{
name:"EXTERIOR LIGHTS",
value:"AS REQUIRED",
done:false
},

{
name:"DOORS",
value:"OPEN",
done:false
}

]

}

]

},

    {
title:"SECURING AIRCRAFT",

sections:[

{
title:"",

items:[

{
name:"IRS MODE SELECTORS",
value:"OFF",
done:false
},

{
name:"APU",
value:"OFF",
done:false
},

{
name:"L AFT FUEL PUMP",
value:"OFF",
done:false
},

{
name:"EMERGENCY EXIT LIGHTS",
value:"OFF",
done:false
},

{
name:"WINDOW HEAT",
value:"OFF",
done:false
},

{
name:"PACKS",
value:"OFF",
done:false
},

{
name:"CABIN LIGHTS",
value:"OFF",
done:false
},

{
name:"EXTERIOR LIGHTS",
value:"OFF",
done:false
},

{
name:"STANDBY POWER",
value:"OFF",
done:false
},

{
name:"BATTERY",
value:"OFF",
done:false
}

]

}

]

}

];

let savedChecklists =
JSON.parse(localStorage.getItem("aerolog_checklists"));

if(savedChecklists){

checklists = savedChecklists;

}
let currentChecklist =
Number(localStorage.getItem("aerolog_current_checklist")) || 0;
function loadChecklist(){
currentChecklist = Number(localStorage.getItem("aerolog_current_checklist")) || 0;
let active = checklists[currentChecklist];
    
let totalItems = 0;
let completedItems = 0;


if(active.sections){

active.sections.forEach(section=>{

section.items.forEach(item=>{

totalItems++;

if(item.done){
completedItems++;
}

});

});

}

else{

active.items.forEach(item=>{

totalItems++;

if(item.done){
completedItems++;
}

});

}


let progress =
totalItems > 0
?
Math.round((completedItems / totalItems) * 100)
:
0;









totalItems > 0
?
Math.round((completedItems / totalItems) * 100)
:
0;


content.innerHTML = `

<section class="hero">

<p class="label">
AIRCRAFT
</p>

<h2>
BOEING 737 MAX 8
</h2>

<p>
NORMAL CHECKLIST
</p>





<div class="check-progress">

<h3>
${active.title}
</h3>

<p>
${completedItems} / ${totalItems} COMPLETED
</p>


<div class="progress-bar">

<div 
class="progress-fill"
style="width:${progress}%">
</div>

</div>


</div>

</section>


<section class="recent">

${checklists.map((list,index)=>`

<div class="check-card ${index === currentChecklist ? "active-check" : ""}">


<div class="check-title" onclick="toggleChecklist(${index})">

<span>
▼ ${list.title}
</span>

</div>



<div class="check-body" id="check-${index}" style="display:none">


${
list.sections

?

list.sections.map((section,s)=>`

<h4>
${section.title}
</h4>


${section.items.map((item,i)=>`

<div class="check-row">

<div>
${item.name}
</div>


<div>
${item.value}
</div>

<input 
type="checkbox"
onclick="event.stopPropagation(); completeCheck(${index},${s},${i})"
${item.done ? "checked":""}
>


</div>


`).join("")}


`).join("")


:

list.items.map((item,i)=>`

<div class="check-row">

<div>
${item.name}
</div>


<div>
${item.value}
</div>


<input 
type="checkbox"
onclick="event.stopPropagation(); completeCheck(${index},null,${i})"
${item.done ? "checked":""}
>


</div>


`).join("")

}


</div>


</div>


`).join("")}


</section>

<button 
class="save"
onclick="restartChecklist()">

RESTART CHECKLIST

</button>
`;

}

function toggleChecklist(id){

let box =
document.getElementById(
"check-"+id
);


if(box.style.display==="none"){

box.style.display="block";

}
else{

box.style.display="none";

}

}
function completeCheck(section,subsection,item,event){



if(subsection !== null){

checklists[section]
.sections[subsection]
.items[item]
.done =
!checklists[section]
.sections[subsection]
.items[item]
.done;

}

else{

checklists[section]
.items[item]
.done =
!checklists[section]
.items[item]
.done;

}


localStorage.setItem(
"aerolog_checklists",
JSON.stringify(checklists)
);
updateChecklistProgress();
}

function checkChecklistProgress(){


let checklist = checklists[currentChecklist];

let items = [];


if(checklist.sections){

checklist.sections.forEach(section=>{

items.push(...section.items);

});

}
else{

items = checklist.items;

}



let completed = items.every(item=>item.done);



if(completed){


if(currentChecklist < checklists.length - 1){


currentChecklist++;


localStorage.setItem(
"aerolog_current_checklist",
currentChecklist
);


loadChecklist();


}


}


}

function restartChecklist(){

checklists.forEach(list=>{

if(list.sections){

list.sections.forEach(section=>{

section.items.forEach(item=>{

item.done = false;

});

});

}

else{

list.items.forEach(item=>{

item.done = false;

});

}

});


currentChecklist = 0;


localStorage.setItem(
"aerolog_current_checklist",
0
);


localStorage.setItem(
"aerolog_checklists",
JSON.stringify(checklists)
);


loadChecklist();

}

function updateChecklistProgress(){

let active = checklists[currentChecklist];

let totalItems = 0;
let completedItems = 0;


if(active.sections){

active.sections.forEach(section=>{

section.items.forEach(item=>{

totalItems++;

if(item.done){
completedItems++;
}

});

});

}

else{

active.items.forEach(item=>{

totalItems++;

if(item.done){
completedItems++;
}

});

}


let progress =
totalItems > 0
?
Math.round((completedItems / totalItems) * 100)
:
0;


document.querySelector(".check-progress p").innerHTML =
`${completedItems} / ${totalItems} COMPLETED`;


document.querySelector(".progress-fill").style.width =
progress + "%";

}
