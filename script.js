function changePage(page){

    const content = document.getElementById("content");


    if(page==="home"){

        content.innerHTML=`
        <section class="dashboard">
        <h2>Dashboard</h2>

        <div class="card">
        <span>Flight Time Totale</span>
        <strong>0h 00m</strong>
        </div>

        </section>
        `;

    }


    if(page==="logbook"){

        content.innerHTML=`
        <section class="dashboard">
        <h2>Logbook</h2>

        <div class="card">
        Nessun volo registrato
        </div>

        </section>
        `;

    }


    if(page==="new"){

        content.innerHTML=`
        <section class="dashboard">
        <h2>Nuovo Volo</h2>

        <div class="card">
        Inserimento volo in arrivo...
        </div>

        </section>
        `;

    }


    if(page==="map"){

        content.innerHTML=`
        <section class="dashboard">
        <h2>Mappa Rotte</h2>

        <div class="card">
        La tua mappa apparirà qui 
        </div>

        </section>
        `;

    }


    if(page==="stats"){

        content.innerHTML=`
        <section class="dashboard">
        <h2>Statistiche</h2>

        <div class="card">
        Nessuna statistica disponibile
        </div>

        </section>
        `;

    }

}
