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

<h2>00h 00m</h2>

<div class="flight-line"></div>

<div class="quick-data">

<div>
<span>FLIGHTS</span>
<strong>0</strong>
</div>

<div>
<span>AIRCRAFT</span>
<strong>0</strong>
</div>

<div>
<span>AIRPORTS</span>
<strong>0</strong>
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


content.innerHTML=`

<section class="hero">

<p class="label">
FLIGHT LOGBOOK
</p>


<h2>0</h2>


<p>
Total recorded flights
</p>


</section>


<section class="recent">

<p class="label">
HISTORY
</p>


<div class="flight-card">

<strong>
No flight history
</strong>


</div>


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

<option>
Boeing 737-800
</option>

<option>
Airbus A320neo
</option>

<option>
Airbus A350-900
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



<button class="save">
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
