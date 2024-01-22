var loginname = 'admin'
var loginpass = 'admin'

var request = new XMLHttpRequest();

request.onreadystatechange = function() {
    // console.log("onreadystatechange: " + request.readyState + ", " +  request.status);
    // console.log(request.responseText);
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            handlers[response._id](response);
        }
        if (request.status == 404) {
            console.log("not found: " + request.responseText);
        }
    }
};

function get(variable) {
    // console.log("get " + variable);
    request.open("GET", dburl + variable, false);
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    request.send();
}

function update() {
    for (var name in handlers) {
        // console.log("updating " + name);
        get(name);
    }
}

// request updates at a fixed interval (ms)
var intervalID = setInterval(update, 1000);

///////////////////////////////////////////////////////////////////////////////
// your code below

var dbname = "hmi";
var dburl = "http://127.0.0.1:5984/" + dbname + "/";
var handlers = {
    "split" : updateSplit,
};

function updateSplit(response) {
    if(response.split === "true"){
        document.querySelector('.split-right').style.display = 'block';
        document.getElementById('location-L').style.display = 'none';
        document.getElementById('location-R').style.display = 'none';
    }
    else {
        document.querySelector('.split-right').style.display = 'none';
        document.getElementById('location-L').style.display = 'block';
        document.getElementById('location-R').style.display = 'block';
    }
    
}



document.getElementById("burger1").addEventListener("click", addSidebar);
document.getElementById("burger2").addEventListener("click", removeSidebar);
document.getElementById("burger1_r").addEventListener("click", addSidebar_r);
document.getElementById("burger2_r").addEventListener("click", removeSidebar_r);


let menuCards = document.querySelectorAll(".menuCard");


menuCards.forEach(function(menuCard) {
    menuCard.addEventListener("click", function flipCard(event){
        let targetElement = event.currentTarget;
        let card = document.querySelector("#" + targetElement.id);
        let img = document.querySelector("#" + targetElement.id + " img");
        let description = document.querySelector("#" + targetElement.id + " .description");

        let valuesDE = "Nährwertangaben:\n\nBrennwert:\t1000kcal\nKohlenhydrate:\t23g\nZucker:\t10g\nEiweiß:\t20g\nSalz:\t20g\nFett:\t5g\n";
        let valuesEN = "Nutritional values:\n\nCalories:\t1000kcal\nCarbohydrates:\t23g\nSugar:\t10g\nProtein:\t20g\nSalt:\t20g\nFat:\t5g\n";
        if( window.getComputedStyle(img).display !== "none"){

            img.style.display = "none";

            const pDE = document.createElement('p');
            pDE.lang = "de";
            pDE.innerText = valuesDE;

            const pEN = document.createElement('p');
            pEN.lang = "en";
            pEN.innerText = valuesEN;

            card.prepend(pDE);
            card.prepend(pEN);
            description.style.whiteSpace = "wrap";

        }else{
            img.style.display = "block";
            description.style.whiteSpace = "nowrap";
            const ps =  document.querySelectorAll("#" + targetElement.id + " p");
            ps.forEach((p) => p.remove())
        }

        //reload language since card back side was not there yet
        selectLanguage();
        selectLanguageRight();
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

function addSidebar_r(){
    let sidebar = document.getElementById("sidebar_r");

    sidebar.style.display = "block";
}

function removeSidebar_r(){
    let sidebar = document.getElementById("sidebar_r");
    sidebar.style.display = "none";
}

/* filter allergen */


function allergenList(side){
    var labels = document.querySelectorAll(side + " label.container ");
    let lang = document.querySelector(side + " .language-selector").value;
    if(lang === "1") lang = "de";

    console.log("Language: ", lang);
    checkedAllergens = []
    labels.forEach(function(label) {
        var checkbox = label.querySelector('input[type="checkbox"]');
        var labelText = label.querySelector('[lang="' + lang + '"]').textContent.trim();
        console.log(checkbox);
        if (checkbox.checked) {
            console.log(labelText); 
            checkedAllergens.push(labelText);
        }
    });
    console.log(checkedAllergens)
    selectText = "Ausgewählte Filter: ";
    if (lang === "en") selectText = "Selected filters: ";
    if (checkedAllergens.length === 0) selectText = "";
    return selectText + checkedAllergens.join(", ");
}


let allergens_L = document.querySelectorAll(".split-left .container input");

allergens_L.forEach( function(allergen){

    allergen.addEventListener("change", function filterAllergene(event){
        let menucards = document.querySelectorAll(".split-left .menuCard");
        let allergens = document.querySelectorAll(".split-left .container input");
        if (this.checked) {
            menucards.forEach(function(menucard){
                let allergy = menucard.getAttribute("allergen");

                if(allergy.includes(allergen.id)){
                    menucard.style.display = "none";
                }
            });
        } else {

            menucards.forEach(function(menucard){
                let allergy = menucard.getAttribute("allergen");

                if(allergy.includes(allergen.id)){
                    menucard.style.display = "block";
                }
            });
            allergens.forEach( function(a){
                if (a.checked) {
                    menucards.forEach(function(menucard){
                        let allergy = menucard.getAttribute("allergen");
    
                        if(allergy.includes(a.id)){
                            menucard.style.display = "none";
                        }
                    });
                }
            }); 
        }
        let aList = allergenList(".split-left");
        let filter_display = document.getElementById("filter-display-L");
        console.log(aList);
        if (aList === ""){
            filter_display.style.display = "none";
        }
        else {
            filter_display.style.display = "block";
            filter_display.innerText =  aList;
        }
    });
    
});


let allergens_R = document.querySelectorAll(".split-right .container input");

allergens_R.forEach( function(allergen){

    allergen.addEventListener("change", function filterAllergene(event){
        let menucards = document.querySelectorAll(".split-right .menuCard");
        let allergens = document.querySelectorAll(".split-right .container input");
        if (this.checked) {
            menucards.forEach(function(menucard){
                let allergy = menucard.getAttribute("allergen");

                if(allergy.includes(allergen.id)){
                    menucard.style.display = "none";
                }
            });
        } else {

            menucards.forEach(function(menucard){
                let allergy = menucard.getAttribute("allergen");

                if(allergy.includes(allergen.id)){
                    menucard.style.display = "block";
                }
            });
            allergens.forEach( function(a){
                if (a.checked) {
                    menucards.forEach(function(menucard){
                        let allergy = menucard.getAttribute("allergen");
    
                        if(allergy.includes(a.id)){
                            menucard.style.display = "none";
                        }
                    });
                    console.log(a.id)
                }
            }); 
        }
        let aList = allergenList(".split-right");
        let filter_display = document.getElementById("filter-display-R");
        console.log(aList);
        if (aList === ""){
            filter_display.style.display = "none";
        }

        else {
            filter_display.style.display = "block";
            filter_display.innerText = aList;
        }
    });
});




/* select weekday */

var x, i, j, l, ll, selElmnt, a, b, c;

/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
        /* For each option in the original select element,
        create a new DIV that will act as an option item: */
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function(e) {
            /* When an item is clicked, update the original select box,
            and the selected item: */
            var y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    yl = y.length;
                    for (k = 0; k < yl; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function(e) {
        /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}

function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}

document.getElementById("language-L").onclick = selectLanguage;

function selectLanguage() {
    let lang = document.getElementById("language-select-L").value;
    if(lang === "1") lang = "de";

    console.log("Language left selected:" +  lang);
    document.querySelectorAll(".split-left [lang='en']").forEach((element) => element.style.display = 'none');
    document.querySelectorAll(".split-left [lang='de']").forEach((element) => element.style.display = 'none');
    document.querySelectorAll(".split-left [lang='" + lang + "']").forEach((element) => element.style.display = 'block');
}

selectLanguage();

document.getElementById("language-R").onclick = selectLanguageRight;
function selectLanguageRight() {
    let lang = document.getElementById("language-select-R").value;
    if(lang === "1") lang = "de";

    console.log("Language right selected:" +  lang);
    document.querySelectorAll(".split-right [lang='en']").forEach((element) => element.style.display = 'none');
    document.querySelectorAll(".split-right [lang='de']").forEach((element) => element.style.display = 'none');
    document.querySelectorAll(".split-right [lang='" + lang + "']").forEach((element) => element.style.display = 'block');
}

selectLanguageRight();

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);