


document.getElementById("burger1").addEventListener("click", addSidebar);
document.getElementById("burger2").addEventListener("click", removeSidebar);

let menuCards = document.querySelectorAll(".menuCard");


menuCards.forEach(function(menuCard) {
    menuCard.addEventListener("click", function flipCard(event){
        let targetElement = event.currentTarget;
        let card = document.querySelector("#" + targetElement.id);
        let img = document.querySelector("#" + targetElement.id + " img");

        let values = "Kohlenhydrate:  1000kcal \n Zucker: 10g \n Salz: 20g \n Fett: 5g";

        if( window.getComputedStyle(img).display !== "none"){

            img.style.display = "none";

            const p = document.createElement('p');
            p.innerText = values;
            card.appendChild(p);

        }else{
            img.style.display = "block";
            const p =  document.querySelector("#" + targetElement.id + " p");
            p.remove();
        }
    });
});

function addSidebar(){
    let sidebar = document.getElementById("sidebar");

    sidebar.style.display = "block";
}

function removeSidebar(){
    let sidebar = document.getElementById("sidebar");

    sidebar.style.display = "none";
}
