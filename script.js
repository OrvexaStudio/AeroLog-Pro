const content = document.querySelector("main");


function changePage(page){

content.style.opacity="0";


setTimeout(()=>{


if(page==="home"){

content.innerHTML=`

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

<div>
<strong>No flights recorded</strong>
<p>Add your first flight</p>
</div>

</div>

</section>

`;

}



if(page==="logbook"){


let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];



let list="";


flights.reverse().forEach(flight=>{


list += `

<div class="flight-card">

<div>

<strong>${flight.aircraft}</strong>

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


</div>

`;

});



if(list===""){

list=
`
<div class="flight-card">
No flight history
</div>
`;

}



content.innerHTML=`

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




if(page==="new"){


content.innerHTML=`

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



<input placeholder="Departure ICAO">


<input placeholder="Arrival ICAO">


<input placeholder="Flight Time (HH:MM)">



<select id="flight-type">

<option>
IFR
</option>

<option>
VFR
</option>

</select>



<textarea placeholder="Flight Notes"></textarea>



<button class="save" onclick="saveFlight()">
SAVE FLIGHT
</button>


</section>

`;

}




if(page==="map"){


content.innerHTML=`

<section class="hero">

<p class="label">
FLIGHT MAP
</p>


<div class="map-box">

WORLD MAP

</div>


</section>


`;

}





if(page==="stats"){


content.innerHTML=`

<section class="hero">

<p class="label">
STATISTICS
</p>


<div class="quick-data">


<div>
<span>TOTAL TIME</span>
<strong>0h</strong>
</div>


<div>
<span>DISTANCE</span>
<strong>0</strong>
</div>


</div>


</section>

`;

}



content.style.opacity="1";


},200);


}

function saveFlight(){


const aircraft = document.getElementById("aircraft").value;

const departure = document.querySelectorAll("input")[0].value;

const arrival = document.querySelectorAll("input")[1].value;

const duration = document.querySelectorAll("input")[2].value;

const type = document.getElementById("flight-type").value;



if(!aircraft || !departure || !arrival || !duration){

alert("Complete all flight data");

return;

}



const flight = {

id: Date.now(),

aircraft: aircraft,

departure: departure.toUpperCase(),

arrival: arrival.toUpperCase(),

duration: duration,

type: type,

date: new Date().toLocaleDateString()

};



let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];



flights.push(flight);



localStorage.setItem(
"aerolog_flights",
JSON.stringify(flights)
);



updateStats();



changePage("logbook");


}

function updateStats(){


let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];



let totalMinutes = 0;


flights.forEach(flight=>{


let parts = flight.duration.split(":");


totalMinutes +=
parseInt(parts[0])*60 +
parseInt(parts[1]);


});



localStorage.setItem(
"aerolog_total_minutes",
totalMinutes
);


}

function getFlightStats(){

let flights =
JSON.parse(localStorage.getItem("aerolog_flights")) || [];


let minutes = 0;

let aircraft = [];

let airports = [];


flights.forEach(flight=>{


let time = flight.duration.split(":");


minutes +=
parseInt(time[0]) * 60 +
parseInt(time[1]);


if(!aircraft.includes(flight.aircraft)){
aircraft.push(flight.aircraft);
}


if(!airports.includes(flight.departure)){
airports.push(flight.departure);
}


if(!airports.includes(flight.arrival)){
airports.push(flight.arrival);
}


});



let hours = Math.floor(minutes / 60);

let mins = minutes % 60;



return {

time:
`${hours.toString().padStart(2,"0")}h ${mins.toString().padStart(2,"0")}m`,

flights:
flights.length,

aircraft:
aircraft.length,

airports:
airports.length

};


}
