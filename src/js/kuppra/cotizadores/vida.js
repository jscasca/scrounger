
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
        //
      }
    }
    return crecimiento;
  };

  //Esta funcion debera ser mejorada
  var decrementoSumaAsegurada = function(edad) {
    //
    return '';
  }

  var cotiza = function(edad, ahorro, fuma) {
    var edadFumador = fuma > 0 ? edad : edad - 2;
    return cotizaReal(edadFumador, ahorro);
  };

  var cotizaReal = function(edad, ahorro) {
    var ahorroUdis = ahorro / valorUdi;
    var ahorroAnualUdi = (ahorroUdis * 12) * 10;
    var sumaAsegurada = '' * ahorroUdis;
    //
    return {
      sumaAsegurada: sumaAsegurada * valorUdi,
      a10: ((ahorroAnualUdi + (ahorroAnualUdi * obtenerCrecimientoPorcentual(edad, 'a10'))) * obtenerValorFuturo(10)),
      a15: '',
      a20: '',
      a25: '',
      a30: ''
    }
  };

  return {
    cotiza: cotiza
  }
}