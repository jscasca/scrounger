
module.exports = Cotizador;

function Cotizador() {

  var valorUdi = 6;
  var valorFuturoInicial = 6;
  var valoresFuturos = [
    0, //1
    0.24, //2
    0.25, //3
    0.26, //4
    0.27,
    0.28,
    0.29,
    0.30,
    0.32,
    0.33,
    0.34,
    0.36,
    0.37,
    0.39,
    0.40,
    0.42,
    0.44,
    0.46,
    0.48,
    0.49,
    0.52,
    0.54,
    0.56,
    0.58,
    0.61,
    0.63,
    0.66,
    0.69,
    0.72,
    0.75,
    0.78,
    0.81,
    0.84,
    0.88,
    0.92,
    0.95,
    0.99,
    1.04,
    1.08,
    1.12,
    1.17,
    1.22,
    1.27,
    1.32,
    1.38,
    1.44,
    1.50,
    1.56,
    1.62 //49
  ];

  var crecimientoPorcentual = [
    {
      edad: 20,
      crecimiento: {
        a10: -0.34,
        a15: 1.16,
        a20: 1.21,
        a25: 1.15,
        a30: 1.14
      }
    },
    {
      edad: 25,
      crecimiento: {
        a10: -0.33,
        a15: 1.15,
        a20: 1.21,
        a25: 1.14,
        a30: 1.13
      }
    },
    {
      edad: 30,
      crecimiento: {
        a10: -0.33,
        a15: 1.15,
        a20: 1.20,
        a25: 1.13,
        a30: 1.12
      }
    },
    {
      edad: 35,
      crecimiento: {
        a10: -0.32,
        a15: 1.14,
        a20: 1.19,
        a25: 1.12,
        a30: 1.11
      }
    },
    {
      edad: 40,
      crecimiento: {
        a10: -0.33,
        a15: 1.13,
        a20: 1.18,
        a25: 1.11,
        a30: 1.10
      }
    }
  ];

  var obtenerValorFuturo = function(anos) {
    var valorFuturo = valorFuturoInicial;
    for(var i = 0; i <= anos; i++) {
      valorFuturo = valorFuturo + valoresFuturos[i];
    }
    return valorFuturo;
  };

  var obtenerCrecimientoPorcentual = function(edad, intervalo) {
    var crecimiento = 0;
    for(var i = 0; i < crecimientoPorcentual.length; i++) {
      if(edad < crecimientoPorcentual[i].edad) {
        //use that line
        crecimiento = crecimientoPorcentual[i].crecimiento[intervalo];
        return crecimiento;
      }
    }
    return crecimiento;
  };

  //Esta funcion debera ser mejorada
  var decrementoSumaAsegurada = function(edad) {
    var decrementos = [
      382.39, //20
      372.65, //21
      362.92, //22
      353.18,
      343.45,
      333.71,
      325.41,
      317.11,
      308.82,
      300.52,
      292.22,
      284.78,
      277.34,
      269.91,
      262.47,
      255.03,
      248.27,
      241.51,
      234.74,
      227.98,
      221.22
    ];
    var ventanaDeEdad = edad < 20 ? 20 : edad > 40 ? 40 : edad;
    return decrementos[edad - 20];
  }

  var cotiza = function(edad, ahorro, fuma) {
    var edadFumador = fuma > 0 ? edad : edad - 2;
    return cotizaReal(edadFumador, ahorro);
  };

  var cotizaReal = function(edad, ahorro) {
    var ahorroUdis = ahorro / valorUdi;
    var ahorroAnualUdi = (ahorroUdis * 12) * 10;
    var sumaAsegurada = decrementoSumaAsegurada(edad) * ahorroUdis;
    //
    return {
      sumaAsegurada: sumaAsegurada * valorUdi,
      a10: ((ahorroAnualUdi + (ahorroAnualUdi * obtenerCrecimientoPorcentual(edad, 'a10'))) * obtenerValorFuturo(10)),
      a15: ((ahorroAnualUdi + (ahorroAnualUdi * obtenerCrecimientoPorcentual(edad, 'a15'))) * obtenerValorFuturo(15)),
      a20: ((ahorroAnualUdi + (ahorroAnualUdi * obtenerCrecimientoPorcentual(edad, 'a20'))) * obtenerValorFuturo(20)),
      a25: ((ahorroAnualUdi + (ahorroAnualUdi * obtenerCrecimientoPorcentual(edad, 'a25'))) * obtenerValorFuturo(25)),
      a30: ((ahorroAnualUdi + (ahorroAnualUdi * obtenerCrecimientoPorcentual(edad, 'a30'))) * obtenerValorFuturo(30))
    }
  };

  var valida = function(rEdad, rAhorro, rFuma) {
    
    var edad = parseInt(rEdad);
    var ahorro = parseInt(rAhorro);
    if(edad > 0 && edad < 85 && ahorro > 0 && ahorro < 1000000 && rFuma) {
      return true;
    } else {
      return false;
    }
  };

  return {
    cotiza: cotiza,
    valida: valida
  }
}