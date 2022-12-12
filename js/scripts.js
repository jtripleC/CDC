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

    
    var datos = [{"Id": "1", "Categoria": "Librería", "Producto": "Telefono E221 BLANCO", "Precio": "150", "Imagen": "/img/E221 BLANCO.png", "Descripcion": "Diseño moderno y elegante, para que te sumerjas en el sonido multidimensional de los altavoces estéreo con audio Dolby Atmos®."},
    {"Id": "2", "Categoria": "Samsung", "Producto": "Teléfono Galaxy A03 64GB Azul", "Precio": "154.99", "Imagen": "/img/Galaxy A03.png", "Descripcion": "Diseño estilizado y fácil de portar,  con pantalla LCD y resolución HD+,  para disfrutar de todos tus contenidos."},
    {"Id": "3", "Categoria": "Samsung", "Producto": "Teléfono Galaxy A33 128GB Naranja", "Precio": "159", "Imagen": "/img/Galaxy A33.jpeg", "Descripcion": "Diseño delgado y sofisticado, con cámara en la que podrás grabar videos de calidad cinematográfica sin importar si es de día o de noche."},
    {"Id": "4", "Categoria": "Samsung", "Producto": "Teléfono GALAXY S22 ULTRA SM-S908E", "Precio": "1399", "Imagen": "/img/Galaxy S22 Ultra.png","Descripcion": "Galaxy S22 ULTRA, simetría elegante con su marco pulido y delgado. Con S Pen integrado, expúlsalo desde la parte inferior del smartphone para escribir, hacer un dibujo o controlar tu smartphone. "},
    {"Id": "5", "Categoria": "Samsung", "Producto": "Teléfono GALAXY Z FOLD 4 SM-F936", "Precio": "1899", "Imagen": "/img/Galaxy Z fold.png", "Descripcion": "Pantalla grande y envolvente con un nuevo diseño Slim.  Galaxy Z Fold son  smartphones en uno con menor peso que uno menos flexible."},
    {"Id": "6", "Categoria": "Redmi", "Producto": "Teléfono Redmi 10A Granite Gray", "Precio": "2.5", "Imagen": "/img/Redmi 10A.jpeg", "Descripcion": "Diseño liviano y elegante. Con cámara dual que ofrece fotografías increíbles."},
    {"Id": "7", "Categoria": "Otros", "Producto": "S20FE", "Precio": "150", "Imagen": "/img/S10FE.png", "Descripcion": "Galaxy S20 FE ¡Todo lo que quieras para hacer lo que disfrutas! Pantalla de 6.5 Infinity-O, 6GB de RAM y 128GB ROM de almacenamiento."},
    {"Id": "8", "Categoria": "Samsung", "Producto": "Teléfono Galaxy A03 Core Negro", "Precio": "99", "Imagen": "/img/A03 Core.jpeg", "Descripcion":"Pantalla HD+ para un experiencia de inmersión y disfrutar de contenido en una gran pantalla."},
    {"Id": "9", "Categoria": "Otros", "Producto": "Teléfono E30 Gris", "Precio": "139", "Imagen": "/img/E30.png", "Descripcion": "Captura fotos y videos más nítidos con cualquier luz y ve los resultados en la pantalla ultraamplia de 90 Hz."}];
    
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