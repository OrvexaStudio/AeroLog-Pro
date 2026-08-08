const content = document.querySelector("main");


// CAMBIO PAGINA

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

            case "map":
                loadMapPage();
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
    ${
    stats.flights > 0 
    ? "Flight recorded"
    : "No flights recorded"
    }
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


    flights.reverse().forEach(flight=>{


        list += `
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



<input id="departure" placeholder="Departure ICAO">


<input id="arrival" placeholder="Arrival ICAO">


<input id="duration" placeholder="Flight Time HH:MM">


<select id="flight-type">

<option>
IFR
</option>

<option>
VFR
</option>

</select>



<textarea id="notes" placeholder="Flight Notes"></textarea>



<button class="save" onclick="saveFlight()">

SAVE FLIGHT

</button>



</section>


`;

}



// SALVA VOLO

function saveFlight(){


const flight = {


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

departureCoords: null,

arrivalCoords: null, 

notes:
document.getElementById("notes").value,


date:
new Date().toLocaleDateString()


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



// STATISTICHE

function loadStats(){


let stats = getFlightStats();



content.innerHTML = `


<section class="hero">


<p class="label">
STATISTICS
</p>



<div class="quick-data">


<div>

<span>TOTAL TIME</span>

<strong>${stats.time}</strong>

</div>



<div>

<span>FLIGHTS</span>

<strong>${stats.flights}</strong>

</div>


</div>



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


let t = flight.duration.split(":");


minutes +=
parseInt(t[0])*60 +
parseInt(t[1]);



if(!aircraft.includes(flight.aircraft))
aircraft.push(flight.aircraft);



if(!airports.includes(flight.departure))
airports.push(flight.departure);



if(!airports.includes(flight.arrival))
airports.push(flight.arrival);



});



let hours =
Math.floor(minutes/60);


let mins =
minutes%60;



return {


time:
`${hours}h ${mins}m`,


flights:
flights.length,


aircraft:
aircraft.length,


airports:
airports.length


};


}



// MAPPA

function loadMapPage(){


content.innerHTML = `


<section class="hero">


<p class="label">
FLIGHT MAP
</p>


<div id="map"></div>


</section>


`;



setTimeout(()=>{

loadMap();

},100);


}



async function loadMap(){

let map = L.map("map")
.setView([30,0],2);


L.tileLayer(
"https://tile.openstreetmap.org/{z}/{x}/{y}.png"
).addTo(map);



let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];



for(let flight of flights){


let dep =
await getAirportCoordinates(flight.departure);


let arr =
await getAirportCoordinates(flight.arrival);



if(dep && arr){


L.marker(dep)
.addTo(map)
.bindPopup(flight.departure);



L.marker(arr)
.addTo(map)
.bindPopup(flight.arrival);



L.polyline(

[
dep,
arr
],

{

color:"#E5A742",

weight:4

}

)

.addTo(map);


}


}


}

async function getAirportCoordinates(icao){


let response =
await fetch(
`https://api.example.com/airport/${icao}`
);


let data =
await response.json();



return [

data.latitude,

data.longitude

];


}

function deleteFlight(id){


let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];



flights =
flights.filter(flight => flight.id !== id);



localStorage.setItem(
"aerolog_flights",
JSON.stringify(flights)
);



loadLogbook();

}

function editFlight(id){


let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];



let flight =
flights.find(f => f.id === id);



if(!flight) return;



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
