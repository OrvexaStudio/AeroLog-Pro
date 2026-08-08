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


        <div>

        <strong>
        ${flight.aircraft}
        </strong>


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


    <section class="recent">

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


date:
formatDate(document.getElementById("flight-date").value)

};



if(
!flight.aircraft ||
!flight.departure ||
!flight.arrival ||
!flight.duration
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


flights =
flights.filter(flight=>flight.id !== id);



localStorage.setItem(
"aerolog_flights",
JSON.stringify(flights)
);



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


let time =
flight.duration.split(":");


minutes +=
parseInt(time[0])*60+
parseInt(time[1]);


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

function loadCalendar(){


let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];



let calendar = {};



flights.forEach(flight=>{


if(!calendar[flight.date]){

calendar[flight.date]=[];

}



calendar[flight.date].push(flight);



});



let list = "";



Object.keys(calendar)
.sort()
.reverse()
.forEach(date=>{



list += `


<div class="flight-card">


<div>


<strong>
${date}
</strong>


${calendar[date].map(flight=>`

<p>
✈ ${flight.departure} → ${flight.arrival}
</p>


`).join("")}


</div>



</div>


`;



});



if(list===""){

list=`

<div class="flight-card">

No flights recorded

</div>

`;

}



content.innerHTML = `


<section class="hero">


<p class="label">
FLIGHT CALENDAR
</p>


<h2>
${flights.length}
</h2>


<p>
Scheduled flights
</p>


</section>



<section class="recent">


${list}


</section>


`;

}
