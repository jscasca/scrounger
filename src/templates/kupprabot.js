var testindex = 0;
var loadInProgress = false;//This is set to true when a page is still loading
 
/*********SETTINGS*********************/
var webPage = require('webpage');
var page = webPage.create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';
page.settings.javascriptEnabled = true;
page.settings.loadImages = false;//Script is much faster with this field set to false
phantom.cookiesEnabled = true;
phantom.javascriptEnabled = true;
/*********SETTINGS END*****************/

var login = require('./login');
 
console.log('All settings loaded, start with execution');
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

var args = require('system').args;
var profileLine = args[1];
var profileArray = profileLine.split(';');

console.log(profileArray);

var userProfile = {
    first: profileArray[0], 
    last: profileArray[1], 
    male: profileArray[2] === '1' ? 1 : 0, 
    bday: profileArray[3],
    plan: profileArray[4],
    residence: profileArray[5],
    deducible: profileArray[6],
    suma: profileArray[7],
    unico: profileArray[8] === '1' ? 1 : 0,
    coaseguro: profileArray[9],
    gura: profileArray[10],
    frecuencia: profileArray[11],
    preferente: profileArray[12] === '1' ? 1 : 0
};

console.log(userProfile);
/*var userProfile = {
    first: 'Formal', 
    last: 'Test', 
    male: 1, 
    bday: '10/10/1990',
    plan: '060001001214',
    residence: '7',
    deducible: '50000',
    suma: '300000',
    unico: 1,
    coaseguro: '15 - $70,000.00',
    gura: '25',
    frecuencia: '4',
    preferente: 1
};*/
/**********DEFINE STEPS THAT PHANTOM SHOULD DO***********************/
steps = [
 
	//Step 1 - Open Soluciones SM
    function(){
        console.log('Step 1 - Open home page');
        page.open("https://www.solucionlinemonterrey.mx/CotizadorWebApp/Forms/Firma.aspx", function(status){
			
		});
    },
	//Step 2 - Populate and submit the login form
    function(){
        console.log('Step 2 - Populate and submit the login form');
        console.log(login);
        console.log(login.user);
		page.evaluate(function(credentials){
			document.getElementById("Login1_UserName").value = credentials.user;
            document.getElementById("Login1_Password").value = credentials.password;
            var ev = document.createEvent("MouseEvents");
            ev.initEvent("click", true, true);
            document.getElementById("Login1_LoginButton").dispatchEvent(ev);
		}, login);
    },
    //Step 3 - Go to create a new profile
    function() {
        console.log("Step 3 - Create a new profile");
        page.open("https://www.solucionlinemonterrey.mx/CotizadorWebApp/Forms/Prospecto.aspx?ID=-1", function(status){});
        /*page.evaluate(function(){

        });*/
    },
    //Step 4 - Populate the new profile:
    function(){
        console.log('Step 4 - Populate and submit the new profile');
		page.evaluate(function(profile){
            /** */
            document.querySelector('#sprytextfield1 input[name="Nombre"]').value = profile.first;
            document.querySelector('#sprytextfield2 input[name="Paterno"]').value = profile.last;
            if(profile.male == 1 || profile.male == true) {
                //Male
                document.querySelector('#spryradio1 input[value="1"][name="Sexo"]').checked = true;
            } else {
                ///Female
                document.querySelector('#spryradio1 input[value="2"][name="Sexo"]').checked = true;
            }
            document.querySelector('#ClaveOcupacionCompuesta').value = "228~A";
            var selectChange = document.createEvent('HTMLEvents');
            selectChange.initEvent("change", true, true);
            document.querySelector('#ClaveOcupacionCompuesta').dispatchEvent(selectChange);
            //SM code: remove spry validation on dates
            RemoveValidacion(sprytextfield6);
            document.querySelector('#sprytextfield6 input[name="FechaNacimiento"]').value = profile.bday;
            //sprytextfield6.input.value = "11/11/1980";
            edadAuto();
            var dateChange = document.createEvent('HTMLEvents');
            dateChange.initEvent("change", true, true);
            document.querySelector('#sprytextfield6 input[name="FechaNacimiento"]').dispatchEvent(dateChange);

            document.querySelector('#sprytextfield19 input').value = "";
            document.querySelector('#sprytextfield24 input').value = "";
            document.querySelector('#sprytextfield25 input').value = "";
            document.querySelector('#sprytextfield26 input').value = "";
            document.querySelector('#sprytextfield27 input').value = "";
            document.querySelector('#sprytextfield30 input').value = "";
            document.querySelector('#sprytextfield31 input').value = "";

            var myForm = document.querySelector('.contenedorMargenCabezeraContenido form');
            myForm.onSubmit = function(){return true;};
            fCamposValidos = function(){return true;};

            var click = document.createEvent("MouseEvents");
            click.initEvent("click", true, true);
            document.querySelector('#cmdCotizarProducto').dispatchEvent(click);
            /** */
		}, userProfile);
    },
    //Step 5 - Select Alfa Medical
    function() {
        //
        console.log("Step 5 - Select Alfa Medical");
        page.evaluate(function() {
            //
            var wait = function(ms){
               var start = new Date().getTime();
               var end = start;
               while(end < start + ms) {
                 end = new Date().getTime();
              }
            };
            var click = document.createEvent("MouseEvents");
            click.initEvent("click", true, true);
            document.getElementById('60').firstElementChild.dispatchEvent(click);
            //wait for
            var isReady = false;
            while(!isReady) {
                if(document.querySelector('#btn_nvo') !== null) {
                    document.querySelector('#btn_nvo').dispatchEvent(click);
                    isReady = true;
                }
                //wait(100);
            }
        });
    },

    function() {
        //
        console.log("Step 6 - Change Residence");
        if(userProfile.residence !== '22') {
            //
            page.evaluate(function(profile){
                //
                console.log('Current plan: ' + document.querySelector('#ddlPlan').value);
                var click = document.createEvent("MouseEvents");
                click.initEvent("click", true, true);
                document.querySelector('.modal-footer button').dispatchEvent(click);

                var state = document.querySelector('#ddlResidencia');
                state.value = profile.residence;

                var selectChange = document.createEvent('HTMLEvents');
                selectChange.initEvent("change", true, true);
                document.querySelector('#ddlResidencia').dispatchEvent(selectChange);

            }, userProfile);
        }
    },
    function() {
        //
        console.log("Step 7 - Change Plan");
        //Check if the plan needs to be changed
        if(userProfile.plan !== '060001001213') {
            page.evaluate(function(profile) {
                //
                console.log('Current plan: ' + document.querySelector('#ddlPlan').value);
                var click = document.createEvent("MouseEvents");
                click.initEvent("click", true, true);
                document.querySelector('.modal-footer button').dispatchEvent(click);

                //var plan = document.querySelector('#ddlPlan');
                //plan.value = profile.plan;
                document.querySelector('#ddlPlan').value = profile.plan;
                console.log('Current plan: ' + document.querySelector('#ddlPlan').value);

                var selectChange = document.createEvent('HTMLEvents');
                selectChange.initEvent("change", true, true);
                document.querySelector('#ddlPlan').dispatchEvent(selectChange);
            }, userProfile);
        }
    },

    function() {
        //
        console.log("Step 8 - Change Deducible");
        if(userProfile.deducible !== '16000') {
            //
            page.evaluate(function(profile){
                //
                console.log('Current plan: ' + document.querySelector('#ddlPlan').value);
                var click = document.createEvent("MouseEvents");
                click.initEvent("click", true, true);
                document.querySelector('.modal-footer button').dispatchEvent(click);

                var deducible = document.querySelector('#ddlDeducible');
                deducible.value = profile.deducible;

                var selectChange = document.createEvent('HTMLEvents');
                selectChange.initEvent("change", true, true);
                document.querySelector('#ddlDeducible').dispatchEvent(selectChange);

            }, userProfile);
        }
    },
    //Step 6 - Select the next thing
    function() {
        //
        console.log("Step 9 - Verifiy once");
        //Check if the plan needs to be changed
        if(userProfile.plan !== '060001001213' || userProfile.residence !== '22' || userProfile.deducible !== '16000') {
            page.evaluate(function(profile) {
                //
                console.log('Current plan: ' + document.querySelector('#ddlPlan').value + ' and profile plan:' + profile.plan);
                console.log('Current deducible: ' + document.querySelector('#ddlDeducible').value + ' and profile plan:' + profile.deducible);
                console.log('Current residence: ' + document.querySelector('#ddlResidencia').value + ' and profile plan:' + profile.residencia);
                // var click = document.createEvent("MouseEvents");
                // click.initEvent("click", true, true);
                // document.querySelector('.modal-footer button').dispatchEvent(click);

                // //var plan = document.querySelector('#ddlPlan');
                // //plan.value = profile.plan;
                // document.querySelector('#ddlPlan').value = profile.plan;
                // console.log('Current plan: ' + document.querySelector('#ddlPlan').value);

                // var selectChange = document.createEvent('HTMLEvents');
                // selectChange.initEvent("change", true, true);
                // document.querySelector('#ddlPlan').dispatchEvent(selectChange);
            }, userProfile);
        }
    },

    function() {
        //
        console.log("Step 9 - Change rest of form");
        page.evaluate(function(profile) {
            //
            console.log('Current plan: ' + document.querySelector('#ddlPlan').value);
            var suma = document.getElementById('ctl00_ContentPlaceHolder1_ddlSumaAsegurada');
            suma.value = profile.suma;

            var unico = document.getElementById('chbDeducibleUnico');
            if(profile.unico === 1) unico.checked = true;

            var coaseguro = document.getElementById('ddlCoaseguro');
            coaseguro.value = profile.coaseguro;

            var gura = document.getElementById('ddlGura');
            gura.value = profile.gura; // 0|25|50

            var frecuencia = document.getElementById('ctl00_ContentPlaceHolder1_ddlFrecuenciaDePago');
            frecuencia.value = profile.frecuencia; // 1|2|4|12 

            var preferente = document.getElementById('ctl00_ContentPlaceHolder1_chbPreferente');
            if(profile.preferente === 1) preferente.checked = true;

            var click = document.createEvent("MouseEvents");
            click.initEvent("click", true, true);
            document.querySelector('#btnCalcular').dispatchEvent(click);

            //Click 'Calcular'
        }, userProfile);
    },

    function() {
        //
        console.log("Step 10 - Read results ");
        page.evaluate(function(){
            //
            var primerPago = document.getElementById('ctl00_ContentPlaceHolder1_txbPrimerPago').value;
            var primaNeta = document.getElementById('ctl00_ContentPlaceHolder1_txbPrimaNetaAnual').value;
            console.log('#' + primerPago);
            console.log('#' + primaNeta);
            var suma = document.getElementById('ctl00_ContentPlaceHolder1_txbSumaAsegurada').value;
            var plan = document.getElementById('ctl00_ContentPlaceHolder1_txbPlan').value;
            var unico = document.getElementById('ctl00_ContentPlaceHolder1_txbDeducibleUnico').value;
            var coaseguro = document.getElementById('ctl00_ContentPlaceHolder1_txbCoaseguro').value;
            var deducible = document.getElementById('ctl00_ContentPlaceHolder1_txbDeducible').value;
            var residencia = document.getElementById('ctl00_ContentPlaceHolder1_txbRecidencia').value;
            var chmq = document.getElementById('ctl00_ContentPlaceHolder1_txbChmq').value;
            var result = [
                primerPago, primaNeta, suma, plan, unico, coaseguro, deducible, residencia, chmq
            ];
            console.log('#' + result.join(';'));
            //var primerPago = document.getElementById('ctl00_ContentPlaceHolder1_txbPrimerPago').value;
        });
    }//,

    // function() {
    //     console.log("Last Step - Get the payment")
    //     //var pago = document.querySelector('#ctl00_ContentPlaceHolder1_txbPrimerPago')
    // },
	// //Step 4 - Wait Amazon to login user. After user is successfully logged in, user is redirected to home page. Content of the home page is saved to AmazonLoggedIn.html. You can find this file where phantomjs.exe file is. You can open this file using Chrome to ensure that you are logged in.
    // function(){
	// 	console.log("Step 4 - Wait to login user. After user is successfully logged in, user is redirected to home page. Content of the home page is saved to AmazonLoggedIn.html. You can find this file where phantomjs.exe file is. You can open this file using Chrome to ensure that you are logged in.");
    //      var fs = require('fs');
	// 	 var result = page.evaluate(function() {
	// 		return document.querySelectorAll("html")[0].outerHTML;
	// 	});
    //     fs.write('AmazonLoggedIn.html',result,'w');
    // },
];
/**********END STEPS THAT FANTOM SHOULD DO***********************/
 
//Execute steps one by one
interval = setInterval(executeRequestsStepByStep,50);
 
function executeRequestsStepByStep(){
    if (loadInProgress == false && typeof steps[testindex] == "function") {
        steps[testindex]();
        testindex++;
    }
    if (typeof steps[testindex] != "function") {
        console.log("test complete!");
        phantom.exit();
    }
}
 
page.onLoadStarted = function() {
    loadInProgress = true;
    console.log('Loading started');
};
page.onLoadFinished = function() {
    loadInProgress = false;
    console.log('Loading finished');
};
page.onConsoleMessage = function(msg) {
    console.log(msg);
};