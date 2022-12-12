var miCarrito = angular.module("MiCarrito", []);

miCarrito.controller(
    'DetalleController',
    function($scope, $routeParams, ProductosService) {
        $scope.nuevoID = $routeParams.productoId;
        $scope.producto = ProductosService.filtrar($routeParams.productoId);
    });
miCarrito.controller(
    'ProductosController', 
    ['$scope','ProductosService', 'CarritoService',
function ($scope, prodService, carService) {
    $scope.titulo = "Tienda De Todo";
    $scope.productos = [];
    
    $scope.agregar = function (p) {
        carService.agregar(p);
    }
    
    $scope.formatoMoneda = function(valor){
        var valor = parseFloat(valor);
        return "S/." + Math.floor(valor) + "." + (valor * 100) % 100;
    }
    
    prodService.listar(function(data){
        $scope.productos = data;
        $scope.$apply();
    });
}]);


miCarrito.controller(
    'CarritoController', ['$scope', 'CarritoService',

function ($scope, carService) {
    $scope.carrito = [];
    
    carService.listar(function(data){
        $scope.carrito = data;
    });
    
    /*carService.carrito = $scope.carrito;*/
    
    $scope.precioTotal = function(){
        var total = 0;
        angular.forEach($scope.carrito, function(item){
            total = total + (item.Cantidad * item.Producto.Precio);
        });
        
        return total;
    };
    
    $scope.eliminar = function(item){
        carService.eliminar(item);
    };
    
}]);

miCarrito.filter('formatoMoneda', function() {
    return function(input) {
      var out = "";
      var valor = parseFloat(input);
      out = "S/." + Math.floor(valor) + "." + ((valor * 100) % 100 + '00').substr(0,2);
      return out;
    }
  });

miCarrito.factory('CarritoService', ['$http', function($http){
    var servicio = {};
    
    servicio.carrito = [];
    
    var filtrar = function(id){
        for (var i = 0; i < servicio.carrito.length; i++) {
            if (servicio.carrito[i].Producto.Id == id) {
                return servicio.carrito[i];
            }
        };
        return null;
    };
    
    servicio.agregar = function(p){
        var itemActual = filtrar(p.Id);

        if (!itemActual) {
            servicio.carrito.push({
                Producto: p,
                Cantidad: 1
            });
        } else {
            itemActual.Cantidad++;
        }
        
        
    };
    
    servicio.eliminar = function(item){
        servicio.carrito.splice(servicio.carrito.indexOf(item),1);
    };
    
    servicio.listar = function(fc){
        fc(servicio.carrito);
    };
    
    return servicio;
}]);

miCarrito.factory('ProductosService', ['$http', '$filter', function($http, $filter){
    var servicio = {};

    var usuarios = [];
    $(document).ready(function ()
    {
      $.getJSON( "/datos.json", function( json )
      {        
        var datos = json.productos;        
        for(i in datos)
        {                    
          usuarios.push([datos[i].prod_id, datos[i].correo,datos[i].nacimiento]);          
        }          
      });
    });  

    
    var datos = [{"Id": "1", "Categoria": "Librería", "Producto": "Borrador Perfecto", "Precio": "0.5", "Imagen": "/img/E221 BLANCO.png"},
    {"Id": "2", "Categoria": "Samsung", "Producto": "Teléfono Galaxy A03 64GB Azul", "Precio": "154.99", "Imagen": "/img/Galaxy A03.png"},
    {"Id": "3", "Categoria": "Samsung", "Producto": "Teléfono Galaxy A33 128GB Naranja", "Precio": "159", "Imagen": "/img/Galaxy A33.jpeg"},
    {"Id": "4", "Categoria": "Samsung", "Producto": "Teléfono GALAXY S22 ULTRA SM-S908E", "Precio": "1399", "Imagen": "/img/Galaxy S22 Ultra.png"},
    {"Id": "5", "Categoria": "Samsung", "Producto": "Teléfono GALAXY Z FOLD 4 SM-F936", "Precio": "1899", "Imagen": "/img/Galaxy Z fold.png"},
    {"Id": "6", "Categoria": "Redmi", "Producto": "Teléfono Redmi 10A Granite Gray", "Precio": "2.5", "Imagen": "/img/Redmi 10A.jpeg"},
    {"Id": "7", "Categoria": "Otros", "Producto": "S20FE", "Precio": "150", "Imagen": "/img/S10FE.png"},
    {"Id": "8", "Categoria": "Samsung", "Producto": "Teléfono Galaxy A03 Core Negro", "Precio": "99", "Imagen": "/img/A03 Core.jpeg"},
    {"Id": "9", "Categoria": "Otros", "Producto": "Teléfono E30 Gris", "Precio": "139", "Imagen": "/img/E30.png"}];
    
    servicio.listar = function(fc){
        setTimeout(function() {
            fc(datos);
        }, 1000);
    };
    
    servicio.filtrar = function(reqId) {
        return $filter("filter")(datos, { "Id": reqId })[0];
    };
    
    return servicio;
}]);


miCarrito.config(function($routeProvider) {
    $routeProvider.
      when('/productos', 
           {controller: "ProductosController", templateUrl:'lista.html'}).
    when('/carrito', 
           {controller: "CarritoController", templateUrl:'carrito.html'}).
    when('/detalle/:productoId', 
           {controller: "DetalleController", templateUrl:'detalle.html'}).
      otherwise({redirectTo:'/productos'});
  });