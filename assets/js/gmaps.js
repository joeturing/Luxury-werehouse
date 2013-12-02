/ *!
 * GMaps.js v0.4.8
 * Http://hpneo.github.com/gmaps/
 *
 * Derechos de autor 2013, Gustavo León
 * Publicado bajo la licencia MIT.
 * /

if (! (typeof window.google === window.google.maps 'objeto' &&)) {
  tirar 'Se requiere Google Maps API. Por favor registre la siguiente biblioteca http://maps.google.com/maps/api/js?sensor=true JavaScript.
}

extend_object var = function (obj, new_obj) {
  var name;

  if (obj === new_obj) {
    volver obj;
  }

  de (nombre en new_obj) {
    obj [nombre] = new_obj [nombre];
  }

  volver obj;
};

replace_object var = function (obj, sustituir) {
  var name;

  if (obj === sustituir) {
    volver obj;
  }

  para (nombre de sustituir) {
    if (obj [nombre]! = undefined) {
      obj [nombre] = replace [nombre];
    }
  }

  volver obj;
};

array_map var = function (matriz, callback) {
  var original_callback_params = Array.prototype.slice.call (argumentos, 2),
      array_return = [],
      array_length = Array.length,
      i;

  if (Array.prototype.map && Array.map === Array.prototype.map) {
    array_return = Array.prototype.map.call (array, la función (elemento) {
      callback_params = original_callback_params;
      callback_params.splice (0, 0, artículo);

      volver callback.apply (esto, callback_params);
    });
  }
  else {
    for (i = 0; i <array_length; i + +) {
      callback_params = original_callback_params;
      callback_params.splice (0, 0, array [i]);
      array_return.push (callback.apply (Esto, callback_params));
    }
  }

  volver array_return;
};

array_flat var = function (array) {
  var new_array = [],
      i;

  for (i = 0; i <Array.length; i + +) {
    new_array = new_array.concat (array [i]);
  }

  volver new_array;
};

coordsToLatLngs var = function (coords, useGeoJSON) {
  first_coord var = coords [0],
      second_coord = coords [1];

  si (useGeoJSON) {
    first_coord = coords [1];
    second_coord = coords [0];
  }

  return new google.maps.LatLng (first_coord, second_coord);
};

arrayToLatLng var = function (coords, useGeoJSON) {
  var i;

  for (i = 0; i <coords.length; i + +) {
    if (coords [i]. longitud> 0 && typeof (coords [i] [0]) == "objeto") {
      coords [i] = arrayToLatLng (coords [i], useGeoJSON);
    }
    else {
      coords [i] = coordsToLatLngs (coords [i], useGeoJSON);
    }
  }

  volver coords;
};

getElementById var = function (id, contexto) {
  var element,
  id = id.replace ('#','');

  if ('jQuery' en este contexto &&) {
    elemento = $ ("#" + id, contexto) [0];
  } Else {
    elemento = document.getElementById (id);
  };

  elemento de retorno;
};

findAbsolutePosition var = function (obj) {
  curleft var = 0,
      curtop = 0;

  si (obj.offsetParent) {
    do {
      curleft + = obj.offsetLeft;
      curtop + = obj.offsetTop;
    } While (obj = obj.offsetParent);
  }

  volver [curleft, curtop];
};

GMaps var = (función (global) {
  "Use strict";

  var doc = documento;

  GMaps var = function (options) {
    (¡esto) si volver nuevos GMaps (opciones);

    options.zoom = options.zoom | | 15;
    options.mapType = options.mapType | | 'hoja de ruta';

    var self = esto,
        i,
        events_that_hide_context_menu = ['bounds_changed', 'center_changed', 'click', 'dblclick', 'drag', 'dragend', 'dragstart', 'inactivo', 'maptypeid_changed', 'projection_changed', 'redimensionar', 'tilesloaded' , 'zoom_changed'],
        events_that_doesnt_hide_context_menu = ['mousemove', 'mouseout', 'mouseover'],
        options_to_be_deleted = ['el', 'lat "," lng', 'mapType',, 'height' 'width', 'markerClusterer', 'enableNewStyle'],
        container_id = options.el | | options.div,
        markerClustererFunction = options.markerClusterer,
        mapType = google.maps.MapTypeId [options.mapType.toUpperCase ()],
        map_center = new google.maps.LatLng (options.lat, options.lng),
        ZoomControl = options.zoomControl | | verdad,
        zoomControlOpt = options.zoomControlOpt | | {
          estilo: 'DEFAULT',
          posición: 'TOP_LEFT'
        },
        zoomControlStyle = zoomControlOpt.style | | 'DEFAULT',
        zoomControlPosition = zoomControlOpt.position | | 'TOP_LEFT',
        panControl = options.panControl | | verdad,
        MapTypeControl = options.mapTypeControl | | verdad,
        ScaleControl = options.scaleControl | | verdad,
        streetViewControl = options.streetViewControl | | verdad,
        OverviewMapControl = OverviewMapControl | | verdad,
        map_options = {},
        map_base_options = {
          zoom: this.zoom,
          centro: map_center,
          MapTypeId: mapType
        },
        map_controls_options = {
          panControl: panControl,
          ZoomControl: ZoomControl,
          ZoomControlOptions: {
            estilo: google.maps.ZoomControlStyle [zoomControlStyle],
            posición: google.maps.ControlPosition [zoomControlPosition]
          },
          MapTypeControl: MapTypeControl,
          ScaleControl: ScaleControl,
          streetViewControl: streetViewControl,
          OverviewMapControl: OverviewMapControl
        };

    if (typeof (options.el) === 'cadena' | | typeof (options.div) === 'cadena') {
      this.el = getElementById (container_id, options.context);
    } Else {
      this.el = container_id;
    }

    if (typeof (this.el) === 'undefined' | | this.el === null) {
      tirar 'Ningún elemento definido.';
    }

    window.context_menu = window.context_menu | | {};
    window.context_menu [self.el.id] = {};

    this.controls = [];
    this.overlays = [];
    this.layers = []; / / matriz con kml / GeoRSS y Fusiontables capas, puede haber hasta
    this.singleLayers = {}; / / objeto con las otras capas, sólo uno por capa
    this.markers = [];
    this.polylines = [];
    this.routes = [];
    this.polygons = [];
    this.infoWindow = null;
    this.overlay_el = null;
    this.zoom = options.zoom;
    this.registered_events = {};

    this.el.style.width = options.width | | this.el.scrollWidth | | this.el.offsetWidth;
    this.el.style.height = options.height | | this.el.scrollHeight | | this.el.offsetHeight;

    google.maps.visualRefresh = options.enableNewStyle;

    for (i = 0; i <options_to_be_deleted.length; i + +) {
      eliminar opciones [options_to_be_deleted [i]];
    }

    if (options.disableDefaultUI! = true) {
      map_base_options = extend_object (map_base_options, map_controls_options);
    }

    map_options = extend_object (map_base_options, opciones);

    for (i = 0; i <events_that_hide_context_menu.length; i + +) {
      eliminar map_options [events_that_hide_context_menu [i]];
    }

    for (i = 0; i <events_that_doesnt_hide_context_menu.length; i + +) {
      eliminar map_options [events_that_doesnt_hide_context_menu [i]];
    }

    this.map = new google.maps.Map (this.el, map_options);

    si (markerClustererFunction) {
      this.markerClusterer = markerClustererFunction.apply (esto, [this.map]);
    }

    buildContextMenuHTML var = function (control, e) {
      var html ='',
          Opciones = window.context_menu [self.el.id] [control];

      for (var i en opciones) {
        si (options.hasOwnProperty (i)) {
          opción var = Opciones [i];

          HTML + = '<li> <a id="' + control +'_' + i +'" href="#">' + option.title + '</ a> </ li>';
        }
      }

      if (getElementById ('gmaps_context_menu')!) return;

      context_menu_element var = getElementById ('gmaps_context_menu');
      
      context_menu_element.innerHTML = HTML;

      context_menu_items var = context_menu_element.getElementsByTagName ('a'),
          context_menu_items_count = context_menu_items.length
          i;

      for (i = 0; i <context_menu_items_count; i + +) {
        context_menu_item var = context_menu_items [i];

        assign_menu_item_action var = function (ev) {
          ev.preventDefault ();

          Opciones [this.id.replace (control + '_','')] action.apply (self, [e]).;
          self.hideContextMenu ();
        };

        google.maps.event.clearListeners (context_menu_item, "clic");
        google.maps.event.addDomListenerOnce (context_menu_item, 'click', assign_menu_item_action, false);
      }

      posición var = findAbsolutePosition.apply (esto, [self.el]),
          izquierda = posición [0] + e.pixel.x - 15,
          top = posición [1] + e.pixel.y-15;

      context_menu_element.style.left = izquierda + "px";
      context_menu_element.style.top = top + "px";

      context_menu_element.style.display = 'block';
    };

    this.buildContextMenu = function (control, e) {
      if (de control === 'marcador') {
        e.pixel = {};

        superposición var = new google.maps.OverlayView ();
        overlay.setMap (self.map);
        
        overlay.draw = function () {
          proyección var = overlay.getProjection (),
              posición = e.marker.getPosition ();
          
          e.pixel = projection.fromLatLngToContainerPixel (posición);

          buildContextMenuHTML (control, e);
        };
      }
      else {
        buildContextMenuHTML (control, e);
      }
    };

    this.setContextMenu = function (options) {
      window.context_menu [self.el.id] [options.control] = {};

      var i,
          ul = doc.createElement ('ul');

      for (i en options.options) {
        si (options.options.hasOwnProperty (i)) {
          opción var = options.options [i];

          window.context_menu [self.el.id] [options.control] [option.name] = {
            Título: option.title,
            acción: option.action
          };
        }
      }

      ul.id = 'gmaps_context_menu';
      ul.style.display = 'none';
      ul.style.position = "absoluto";
      ul.style.minWidth = '100px ';
      ul.style.background = 'blanco';
      ul.style.listStyle = 'none';
      ul.style.padding = '8 px ";
      ul.style.boxShadow = '2 px 2px 6px # ccc ';

      doc.body.appendChild (UL);

      context_menu_element var = getElementById ('gmaps_context_menu')

      google.maps.event.addDomListener (context_menu_element, 'mouseout', function (ev) {
        if (ev.relatedTarget | |! this.contains (ev.relatedTarget)) {
          window.setTimeout (function () {
            context_menu_element.style.display = 'none';
          }, 400);
        }
      }, False);
    };

    this.hideContextMenu = function () {
      context_menu_element var = getElementById ('gmaps_context_menu');

      si (context_menu_element) {
        context_menu_element.style.display = 'none';
      }
    };

    setupListener var = function (objeto, nombre) {
      google.maps.event.addListener (objeto, nombre, función (e) {
        if (e == undefined) {
          e = esto;
        }

        . Opciones [nombre] aplicarse (esto, [e]);

        self.hideContextMenu ();
      });
    };

    for (var ev = 0; ev <events_that_hide_context_menu.length; ev + +) {
      var name = events_that_hide_context_menu [EV];

      if (nombre en opciones) {
        setupListener (this.map, nombre);
      }
    }

    for (var ev = 0; ev <events_that_doesnt_hide_context_menu.length; ev + +) {
      var name = events_that_doesnt_hide_context_menu [EV];

      if (nombre en opciones) {
        setupListener (this.map, nombre);
      }
    }

    google.maps.event.addListener (this.map, 'rightclick', function (e) {
      si (options.rightclick) {
        options.rightclick.apply (esto, [e]);
      }

      if (window.context_menu [self.el.id] ['mapa']! = undefined) {
        self.buildContextMenu ("mapa", e);
      }
    });

    This.Refresh = function () {
      google.maps.event.trigger (this.map, 'redimensionar');
    };

    this.fitZoom = function () {
      latLngs var = [],
          markers_length = this.markers.length,
          i;

      for (i = 0; i <markers_length; i + +) {
        latLngs.push (this.markers [i] GetPosition ().);
      }

      this.fitLatLngBounds (latLngs);
    };

    this.fitLatLngBounds = function () {latLngs
      var total = latLngs.length;
      límites var = new google.maps.LatLngBounds ();

      for (var i = 0; i <total, i + +) {
        bounds.extend (latLngs [i]);
      }

      this.map.fitBounds (límites);
    };

    this.setCenter = function (lat, lng, callback) {
      this.map.panTo (nueva google.maps.LatLng (lat, lng));

      if (callback) {
        callback ();
      }
    };

    this.getElement = function () {
      volver this.el;
    };

    this.zoomIn = function (valor) {
      valor = valor | | 1;

      this.zoom = this.map.getZoom () + valor;
      this.map.setZoom (this.zoom);
    };

    this.zoomOut = function (valor) {
      valor = valor | | 1;

      this.zoom = this.map.getZoom () - valor;
      this.map.setZoom (this.zoom);
    };

    native_methods var = [],
        método;

    por (método en this.map) {
      if (typeof (this.map [método]) == 'function' &&! este [método]) {
        native_methods.push (método);
      }
    }

    for (i = 0; i <native_methods.length; i + +) {
      (Function (GMaps, alcance, method_name) {
        gmaps [method_name] = function () {
          alcance regresar [method_name] se aplican (alcance, argumentos).;
        };
      }) (Este, this.map, native_methods [i]);
    }
  };

  volver GMaps;
}) (Este);

GMaps.prototype.createControl = function (opciones) {
  control de var = document.createElement ('div');

  control.style.cursor = 'puntero';
  control.style.fontFamily = 'Arial, sans-serif';
  control.style.fontSize = '13px ';
  control.style.boxShadow = 'rgba (0, 0, 0, 0.398438) 0px 2px 4px';

  for (var opción en options.style) {
    control.style [opción] = options.style [opción];
  }

  si (options.id) {
    control.id = options.id;
  }

  if () {options.classes
    control.className = options.classes;
  }

  si (options.content) {
    control.innerHTML = options.content;
  }

  for (var ev en options.events) {
    (Function (objeto, nombre) {
      google.maps.event.addDomListener (objeto, nombre, function () {
        . options.events [nombre] aplicarse (esto, [esto]);
      });
    }) (De control, EV);
  }

  control.index = 1;

  devolver el control;
};

GMaps.prototype.addControl = function (opciones) {
  posición var = google.maps.ControlPosition [options.position.toUpperCase ()];

  eliminar options.position;

  control de var = this.createControl (opciones);
  this.controls.push (de control);
  
  . this.map.controls [posición] empuje (control);

  devolver el control;
};

GMaps.prototype.createMarker = function (opciones) {
  if (options.lat == indefinido && options.lng == indefinido && options.position == undefined) {
    tirar 'No latitud o longitud definida.';
  }

  var self = esto,
      detalles = options.details,
      vallas = options.fences,
      fuera = options.outside,
      base_options = {
        posición: nueva google.maps.LatLng (options.lat, options.lng),
        Mapa: null
      };

  eliminar options.lat;
  eliminar options.lng;
  eliminar options.fences;
  eliminar options.outside;

  marker_options var = extend_object (base_options, opciones),
      MP = nuevos google.maps.Marker (marker_options);

  marker.fences = cercas;

  si (options.infoWindow) {
    marker.infoWindow = google.maps.InfoWindow nueva (options.infoWindow);

    info_window_events var = ['closeclick', 'content_changed', 'domready', 'position_changed', 'zindex_changed'];

    for (var ev = 0; ev <info_window_events.length; ev + +) {
      (Function (objeto, nombre) {
        if (options.infoWindow [nombre]) {
          google.maps.event.addListener (objeto, nombre, función (e) {
            . options.infoWindow [nombre] aplicarse (esto, [e]);
          });
        }
      }) (Marker.infoWindow, info_window_events [EV]);
    }
  }

  marker_events var = ['animation_changed', 'clickable_changed', 'cursor_changed', 'draggable_changed', 'flat_changed', 'icon_changed', 'position_changed', 'shadow_changed', 'shape_changed', 'title_changed', 'visible_changed', 'zindex_changed '];

  var marker_events_with_mouse = ['dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mouseout', 'mouseover', 'mouseup'];

  for (var ev = 0; ev <marker_events.length; ev + +) {
    (Function (objeto, nombre) {
      if (opciones [nombre]) {
        google.maps.event.addListener (objeto, nombre, function () {
          . Opciones [nombre] aplicarse (esto, [esto]);
        });
      }
    }) (Marcador, marker_events [EV]);
  }

  for (var ev = 0; ev <marker_events_with_mouse.length; ev + +) {
    (Function (mapa, objeto, nombre) {
      if (opciones [nombre]) {
        google.maps.event.addListener (objeto, nombre, función (yo) {
          if (! me.pixel) {
            me.pixel = map.getProjection (). fromLatLngToPoint (me.latLng)
          }
          
          . Opciones [nombre] aplicarse (esto, [me]);
        });
      }
    }) (This.map, marcador, marker_events_with_mouse [EV]);
  }

  google.maps.event.addListener (marcador, 'click', function () {
    this.details = detalles;

    si (options.click) {
      options.click.apply (esto, [esto]);
    }

    si (marker.infoWindow) {
      self.hideInfoWindows ();
      marker.infoWindow.open (self.map, marcador);
    }
  });

  google.maps.event.addListener (marcador, "click derecho ', function (e) {
    e.marker = this;

    si (options.rightclick) {
      options.rightclick.apply (esto, [e]);
    }

    if (window.context_menu [self.el.id] ['marcador']! = undefined) {
      self.buildContextMenu ("marcador", e);
    }
  });

  if () {marker.fences
    google.maps.event.addListener (marcador, 'dragend', function () {
      self.checkMarkerGeofence (marcador, función (m, f) {
        exterior (m, f);
      });
    });
  }

  volver marcador;
};

GMaps.prototype.addMarker = function (opciones) {
  marcador var;
  if (options.hasOwnProperty ('gm_accessors_')) {
    Objeto / / Nativo google.maps.Marker
    MP = opciones;
  }
  else {
    if ((options.hasOwnProperty ('lat') && options.hasOwnProperty ('lng')) | | options.position) {
      MP = this.createMarker (opciones);
    }
    else {
      tirar 'No latitud o longitud definida.';
    }
  }

  marker.setMap (this.map);

  si (this.markerClusterer) {
    this.markerClusterer.addMarker (marcador);
  }

  this.markers.push (marcador);

  GMaps.fire ('marker_added', marcador, this);

  volver marcador;
};

GMaps.prototype.addMarkers = function (array) {
  for (var i = 0, marcador, marcador = array [i]; i + +) {
    this.addMarker (marcador);
  }

  volver this.markers;
};

GMaps.prototype.hideInfoWindows = function () {
  for (var i = 0, marcador, marcadores = this.markers [i]; i + +) {
    si (marker.infoWindow) {
      marker.infoWindow.close ();
    }
  }
};

GMaps.prototype.removeMarker = function (marcador) {
  for (var i = 0; i <this.markers.length; i + +) {
    if (this.markers [i] === marcadoras) {
      . this.markers [i] setMap (null);
      this.markers.splice (i, 1);

      si (this.markerClusterer) {
        this.markerClusterer.removeMarker (marcador);
      }

      GMaps.fire ('marker_removed', marcador, this);

      romper;
    }
  }

  volver marcador;
};

GMaps.prototype.removeMarkers = function (colección) {
  colección var = (colección | | this.markers);

  for (var i = 0; i <this.markers.length; i + +) {
    if (this.markers [i] === colección [i]) {
      . this.markers [i] setMap (null);
    }
  }

  new_markers var = [];

  for (var i = 0; i <this.markers.length; i + +) {
    if (this.markers [i]. getMap ()! = null) {
      new_markers.push (this.markers [i]);
    }
  }

  this.markers = new_markers;
};

GMaps.prototype.drawOverlay = function (opciones) {
  superposición var = new google.maps.OverlayView (),
      auto_show = true;

  overlay.setMap (this.map);

  if (options.auto_show! = null) {
    auto_show = options.auto_show;
  }

  overlay.onAdd = function () {
    var el = document.createElement ('div');

    el.style.borderStyle = "none";
    el.style.borderWidth = "0px";
    el.style.position = "absoluta";
    el.style.zIndex = 100;
    el.innerHTML = options.content;

    overlay.el = el;

    if (! options.layer) {
      options.layer = 'overlayLayer';
    }
    
    var paneles = this.getPanes (),
        overlayLayer = paneles [options.layer],
        stop_overlay_events = ['contextual', 'DOMMouseScroll', 'dblclick', 'mousedown'];

    overlayLayer.appendChild (EL);

    for (var ev = 0; ev <stop_overlay_events.length; ev + +) {
      (Function (objeto, nombre) {
        google.maps.event.addDomListener (objeto, nombre, función (e) {
          if (navigator.userAgent.toLowerCase (). indexOf ('msie')! = -1 && document.all) {
            e.cancelBubble = true;
            e.returnValue = false;
          }
          else {
            e.stopPropagation ();
          }
        });
      }) (El, stop_overlay_events [EV]);
    }

    google.maps.event.trigger (esto, "listo");
  };

  overlay.draw = function () {
    proyección var = this.getProjection (),
        pixel = projection.fromLatLngToDivPixel (nueva google.maps.LatLng (options.lat, options.lng));

    options.horizontalOffset = options.horizontalOffset | | 0;
    options.verticalOffset = options.verticalOffset | | 0;

    var el = overlay.el,
        content = el.children [0],
        content_height = content.clientHeight,
        content_width = content.clientWidth;

    switch (options.verticalAlign) {
      caso 'top':
        el.style.top = (pixel.y - content_height + options.verticalOffset) + 'px';
        romper;
      por defecto:
      caso "medio":
        el.style.top = (pixel.y - (content_height / 2) + options.verticalOffset) + 'px';
        romper;
      caso 'bottom':
        el.style.top = (pixel.y + options.verticalOffset) + "px";
        romper;
    }

    switch (options.horizontalAlign) {
      case 'izquierda':
        el.style.left = (pixel.x - content_width + options.horizontalOffset) + "px";
        romper;
      por defecto:
      caso "centro":
        el.style.left = (pixel.x - (content_width / 2) + options.horizontalOffset) + "px";
        romper;
      caso "derecho":
        el.style.left = (pixel.x + options.horizontalOffset) + "px";
        romper;
    }

    el.style.display = auto_show? 'Block': 'none';

    if (! auto_show) {
      options.show.apply (esto, [el]);
    }
  };

  overlay.onRemove = function () {
    var el = overlay.el;

    si (options.remove) {
      options.remove.apply (esto, [el]);
    }
    else {
      overlay.el.parentNode.removeChild (overlay.el);
      overlay.el = null;
    }
  };

  this.overlays.push (overlay);
  volver superposición;
};

GMaps.prototype.removeOverlay = function (overlay) {
  for (var i = 0; i <this.overlays.length; i + +) {
    if (this.overlays [i] === overlay) {
      . this.overlays [i] setMap (null);
      this.overlays.splice (i, 1);

      romper;
    }
  }
};

GMaps.prototype.removeOverlays = function () {
  for (var i = 0, el punto, el punto = this.overlays [i]; i + +) {
    item.setMap (null);
  }

  this.overlays = [];
};

GMaps.prototype.drawPolyline = function (opciones) {
  ruta var = [],
      puntos = options.path;

  si (points.length) {
    if (puntos [0] [0] === undefined) {
      path = puntos;
    }
    else {
      for (var i = 0, latlng; latlng = puntos [i]; i + +) {
        path.push (nueva google.maps.LatLng (latlng [0], latlng [1]));
      }
    }
  }

  polyline_options var = {
    Mapa: this.map,
    path: ruta,
    strokeColor: options.strokeColor,
    strokeOpacity: options.strokeOpacity,
    strokeWeight: options.strokeWeight,
    geodésica: options.geodesic,
    clickable: true,
    editable: false,
    visible: true
  };

  if (options.hasOwnProperty ("hacer clic")) {
    polyline_options.clickable = options.clickable;
  }

  if (options.hasOwnProperty ("editable")) {
    polyline_options.editable = options.editable;
  }

  if (options.hasOwnProperty ("iconos")) {
    polyline_options.icons = options.icons;
  }

  if (options.hasOwnProperty ("zIndex")) {
    polyline_options.zIndex = options.zIndex;
  }

  polilínea var = new google.maps.Polyline (polyline_options);

  polyline_events var = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'click derecho'];

  for (var ev = 0; ev <polyline_events.length; ev + +) {
    (Function (objeto, nombre) {
      if (opciones [nombre]) {
        google.maps.event.addListener (objeto, nombre, función (e) {
          . Opciones [nombre] aplicarse (esto, [e]);
        });
      }
    }) (Polilínea, polyline_events [EV]);
  }

  this.polylines.push (polilínea);

  GMaps.fire ('polyline_added', polilínea, this);

  volver polilínea;
};

GMaps.prototype.removePolyline = function (polilínea) {
  for (var i = 0; i <this.polylines.length; i + +) {
    if (this.polylines [i] === polilínea) {
      . this.polylines [i] setMap (null);
      this.polylines.splice (i, 1);

      GMaps.fire ('polyline_removed', polilínea, this);

      romper;
    }
  }
};

GMaps.prototype.removePolylines = function () {
  for (var i = 0, el punto, el punto = this.polylines [i]; i + +) {
    item.setMap (null);
  }

  this.polylines = [];
};

GMaps.prototype.drawCircle = function (opciones) {
  Opciones = extend_object ({
    Mapa: this.map,
    Centro: nueva google.maps.LatLng (options.lat, options.lng)
  }, Opciones);

  eliminar options.lat;
  eliminar options.lng;

  polígono var = new google.maps.Circle (opciones),
      polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'click derecho'];

  for (var ev = 0; ev <polygon_events.length; ev + +) {
    (Function (objeto, nombre) {
      if (opciones [nombre]) {
        google.maps.event.addListener (objeto, nombre, función (e) {
          . Opciones [nombre] aplicarse (esto, [e]);
        });
      }
    }) (Polígono, polygon_events [EV]);
  }

  this.polygons.push (polígono);

  volver polígono;
};

GMaps.prototype.drawRectangle = function (opciones) {
  Opciones = extend_object ({
    Mapa: this.map
  }, Opciones);

  LatLngBounds var = new google.maps.LatLngBounds (
    nueva google.maps.LatLng (options.bounds [0] [0], options.bounds [0] [1]),
    nueva google.maps.LatLng (options.bounds [1] [0], options.bounds [1] [1])
  );

  options.bounds = LatLngBounds;

  polígono var = new google.maps.Rectangle (opciones),
      polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'click derecho'];

  for (var ev = 0; ev <polygon_events.length; ev + +) {
    (Function (objeto, nombre) {
      if (opciones [nombre]) {
        google.maps.event.addListener (objeto, nombre, función (e) {
          . Opciones [nombre] aplicarse (esto, [e]);
        });
      }
    }) (Polígono, polygon_events [EV]);
  }

  this.polygons.push (polígono);

  volver polígono;
};

GMaps.prototype.drawPolygon = function (opciones) {
  useGeoJSON var = false;

  si (options.hasOwnProperty ("useGeoJSON")) {
    useGeoJSON = options.useGeoJSON;
  }

  eliminar options.useGeoJSON;

  Opciones = extend_object ({
    Mapa: this.map
  }, Opciones);

  if (useGeoJSON == false) {
    options.paths = [options.paths.slice (0)];
  }

  si (options.paths.length> 0) {
    si (longitud options.paths [0].> 0) {
      options.paths = array_flat (array_map (options.paths, arrayToLatLng, useGeoJSON));
    }
  }

  polígono var = new google.maps.Polygon (opciones),
      polygon_events = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'click derecho'];

  for (var ev = 0; ev <polygon_events.length; ev + +) {
    (Function (objeto, nombre) {
      if (opciones [nombre]) {
        google.maps.event.addListener (objeto, nombre, función (e) {
          . Opciones [nombre] aplicarse (esto, [e]);
        });
      }
    }) (Polígono, polygon_events [EV]);
  }

  this.polygons.push (polígono);

  GMaps.fire ('polygon_added', polígono, this);

  volver polígono;
};

GMaps.prototype.removePolygon = function (polígono) {
  for (var i = 0; i <this.polygons.length; i + +) {
    if (this.polygons [i] === polígono) {
      . this.polygons [i] setMap (null);
      this.polygons.splice (i, 1);

      GMaps.fire ('polygon_removed', polígono, this);

      romper;
    }
  }
};

GMaps.prototype.removePolygons = function () {
  for (var i = 0, el punto, el punto = this.polygons [i]; i + +) {
    item.setMap (null);
  }

  this.polygons = [];
};

GMaps.prototype.getFromFusionTables = function (opciones) {
  eventos var = options.events;

  eliminar options.events;

  fusion_tables_options var = opciones,
      capa = nuevos google.maps.FusionTablesLayer (fusion_tables_options);

  for (var ev en eventos) {
    (Function (objeto, nombre) {
      google.maps.event.addListener (objeto, nombre, función (e) {
        . eventos [nombre] aplicarse (esto, [e]);
      });
    }) (Capa, EV);
  }

  this.layers.push (capa);

  volver capa;
};

GMaps.prototype.loadFromFusionTables = function (opciones) {
  capa var = this.getFromFusionTables (opciones);
  layer.setMap (this.map);

  volver capa;
};

GMaps.prototype.getFromKML = function (opciones) {
  var url = options.url,
      eventos = options.events;

  eliminar options.url;
  eliminar options.events;

  kml_options var = opciones,
      capa = new google.maps.KmlLayer (url, kml_options);

  for (var ev en eventos) {
    (Function (objeto, nombre) {
      google.maps.event.addListener (objeto, nombre, función (e) {
        . eventos [nombre] aplicarse (esto, [e]);
      });
    }) (Capa, EV);
  }

  this.layers.push (capa);

  volver capa;
};

GMaps.prototype.loadFromKML = function (opciones) {
  capa var = this.getFromKML (opciones);
  layer.setMap (this.map);

  volver capa;
};

GMaps.prototype.addLayer = function (layerName, options) {
  Default_layers / / var = ['Tiempo', "nubes", "tráfico", "tránsito", "bicicleta", "Panoramio", "lugares"];
  options = Opciones | | {};
  capa var;

  switch (layerName) {
    caso "tiempo": this.singleLayers.weather = capa = new google.maps.weather.WeatherLayer ();
      romper;
    case 'nubes': this.singleLayers.clouds = capa = new google.maps.weather.CloudLayer ();
      romper;
    caso "tráfico": this.singleLayers.traffic = capa = new google.maps.TrafficLayer ();
      romper;
    caso de "tránsito": this.singleLayers.transit = capa = new google.maps.TransitLayer ();
      romper;
    case 'bicicleta': this.singleLayers.bicycling = capa = new google.maps.BicyclingLayer ();
      romper;
    case 'panoramio':
        this.singleLayers.panoramio = capa = new google.maps.panoramio.PanoramioLayer ();
        layer.setTag (options.filter);
        eliminar options.filter;

        / / Haga clic en evento
        si (options.click) {
          google.maps.event.addListener (capa, 'click', function (event) {
            options.click (evento);
            eliminar options.click;
          });
        }
      romper;
      casos "lugares":
        this.singleLayers.places = capa = new google.maps.places.PlacesService (this.map);

        / / Buscar y nearbySearch devolución de llamada, ambos son la misma
        if (options.search | | options.nearbySearch) {
          var placeSearchRequest = {
            límites: options.bounds | | null,
            palabra clave: options.keyword | | null,
            ubicación: options.location | | null,
            Nombre: options.name | | null,
            radio: options.radius | | null,
            rankBy: options.rankBy | | null,
            tipos: options.types | | nula
          };

          si (options.search) {
            layer.search (placeSearchRequest, options.search);
          }

          si (options.nearbySearch) {
            layer.nearbySearch (placeSearchRequest, options.nearbySearch);
          }
        }

        / / TEXTSEARCH callback
        si (options.textSearch) {
          var textSearchRequest = {
            límites: options.bounds | | null,
            ubicación: options.location | | null,
            consulta: options.query | | null,
            radio: options.radius | | nula
          };

          layer.textSearch (textSearchRequest, options.textSearch);
        }
      romper;
  }

  if (capa! == undefined) {
    if (typeof "función" layer.setOptions ==) {
      layer.setOptions (opciones);
    }
    if (typeof layer.setMap == 'function') {
      layer.setMap (this.map);
    }

    volver capa;
  }
};

GMaps.prototype.removeLayer = function (capa) {
  if (typeof (capa) == "cadena" && this.singleLayers [capa]! == undefined) {
     this.singleLayers [capa] setMap (null).;

     eliminar this.singleLayers [capa];
  }
  else {
    for (var i = 0; i <this.layers.length; i + +) {
      if (this.layers [i] === capa) {
        . this.layers [i] setMap (null);
        this.layers.splice (i, 1);

        romper;
      }
    }
  }
};

travelMode var, unitSystem;

GMaps.prototype.getRoutes = function (opciones) {
  switch (options.travelMode) {
    case 'bicicleta':
      travelMode = google.maps.TravelMode.BICYCLING;
      romper;
    caso «tránsito»:
      travelMode = google.maps.TravelMode.TRANSIT;
      romper;
    case 'conducción':
      travelMode = google.maps.TravelMode.DRIVING;
      romper;
    por defecto:
      travelMode = google.maps.TravelMode.WALKING;
      romper;
  }

  if (options.unitSystem === 'imperial') {
    unitSystem = google.maps.UnitSystem.IMPERIAL;
  }
  else {
    unitSystem = google.maps.UnitSystem.METRIC;
  }

  base_options var = {
        avoidHighways: false,
        avoidTolls: false,
        optimizeWaypoints: false,
        waypoints: []
      },
      request_options = extend_object (base_options, opciones);

  request_options.origin = / string / .test (options.origin typeof)? options.origin: nueva google.maps.LatLng (options.origin [0], options.origin [1]);
  request_options.destination = / string / .test (options.destination typeof)? options.destination: nueva google.maps.LatLng (options.destination [0], options.destination [1]);
  request_options.travelMode = travelMode;
  request_options.unitSystem = unitSystem;

  eliminar request_options.callback;
  eliminar request_options.error;

  var self = esto,
      servicio = new google.maps.DirectionsService ();

  service.route (request_options, función (resultado, el estado) {
    si (estado === google.maps.DirectionsStatus.OK) {
      for (var r en result.routes) {
        si (result.routes.hasOwnProperty (r)) {
          self.routes.push (result.routes [r]);
        }
      }

      si (options.callback) {
        options.callback (self.routes);
      }
    }
    else {
      si (options.error) {
        options.error (resultado, el estado);
      }
    }
  });
};

GMaps.prototype.removeRoutes = function () {
  this.routes = [];
};

GMaps.prototype.getElevations = function (opciones) {
  Opciones = extend_object ({
    localidades: [],
    ruta: false,
    muestras: 256
  }, Opciones);

  si (options.locations.length> 0) {
    si (longitud options.locations [0].> 0) {
      options.locations = array_flat (array_map ([options.locations], arrayToLatLng, false));
    }
  }

  callback var = options.callback;
  eliminar options.callback;

  servicio de var = new google.maps.ElevationService ();

  / / Solicitud de ubicación
  if (! options.path) {
    eliminar options.path;
    eliminar options.samples;

    service.getElevationForLocations (opciones, función (resultado, el estado) {
      if (callback && typeof (callback) === "función") {
        de devolución de llamada (resultado, el estado);
      }
    });
  / Petición / path
  } Else {
    pathRequest var = {
      Ruta: options.locations,
      muestras: options.samples
    };

    service.getElevationAlongPath (pathRequest, función (resultado, el estado) {
     if (callback && typeof (callback) === "función") {
        de devolución de llamada (resultado, el estado);
      }
    });
  }
};

GMaps.prototype.cleanRoute = GMaps.prototype.removePolylines;

GMaps.prototype.drawRoute = function (opciones) {
  var self = this;

  this.getRoutes ({
    origen: options.origin,
    destino: options.destination,
    travelMode: options.travelMode,
    waypoints: options.waypoints,
    unitSystem: options.unitSystem,
    error: options.error,
    callback: function (e) {
      si (e.length> 0) {
        self.drawPolyline ({
          path:. e [e.length - 1] overview_path,
          strokeColor: options.strokeColor,
          strokeOpacity: options.strokeOpacity,
          strokeWeight: options.strokeWeight
        });
        
        si (options.callback) {
          options.callback (e [e.length - 1]);
        }
      }
    }
  });
};

GMaps.prototype.travelRoute = function (opciones) {
  si (options.origin && options.destination) {
    this.getRoutes ({
      origen: options.origin,
      destino: options.destination,
      travelMode: options.travelMode,
      waypoints: options.waypoints,
      error: options.error,
      callback: function (e) {
        / / Inicio de devolución de llamada
        si (e.length> 0 && options.start) {
          options.start (e [e.length - 1]);
        }

        / / Paso de devolución de llamada
        si (e.length> 0 && options.step) {
          ruta var = e [e.length - 1];
          si (route.legs.length> 0) {
            pasos var = route.legs [0] pasos.;
            for (var i = 0, paso, paso = pasos [i]; i + +) {
              step.step_number = i;
              options.step (paso, (route.legs [0] steps.length - 1).);
            }
          }
        }

        / / Fin de devolución de llamada
        si (e.length> 0 && options.end) {
           options.end (e [e.length - 1]);
        }
      }
    });
  }
  else if (options.route) {
    si (options.route.legs.length> 0) {
      pasos var = options.route.legs [0] pasos.;
      for (var i = 0, paso, paso = pasos [i]; i + +) {
        step.step_number = i;
        options.step (paso);
      }
    }
  }
};

GMaps.prototype.drawSteppedRoute = function (opciones) {
  var self = this;
  
  si (options.origin && options.destination) {
    this.getRoutes ({
      origen: options.origin,
      destino: options.destination,
      travelMode: options.travelMode,
      waypoints: options.waypoints,
      error: options.error,
      callback: function (e) {
        / / Inicio de devolución de llamada
        si (e.length> 0 && options.start) {
          options.start (e [e.length - 1]);
        }

        / / Paso de devolución de llamada
        si (e.length> 0 && options.step) {
          ruta var = e [e.length - 1];
          si (route.legs.length> 0) {
            pasos var = route.legs [0] pasos.;
            for (var i = 0, paso, paso = pasos [i]; i + +) {
              step.step_number = i;
              self.drawPolyline ({
                path: step.path,
                strokeColor: options.strokeColor,
                strokeOpacity: options.strokeOpacity,
                strokeWeight: options.strokeWeight
              });
              options.step (paso, (route.legs [0] steps.length - 1).);
            }
          }
        }

        / / Fin de devolución de llamada
        si (e.length> 0 && options.end) {
           options.end (e [e.length - 1]);
        }
      }
    });
  }
  else if (options.route) {
    si (options.route.legs.length> 0) {
      pasos var = options.route.legs [0] pasos.;
      for (var i = 0, paso, paso = pasos [i]; i + +) {
        step.step_number = i;
        self.drawPolyline ({
          path: step.path,
          strokeColor: options.strokeColor,
          strokeOpacity: options.strokeOpacity,
          strokeWeight: options.strokeWeight
        });
        options.step (paso);
      }
    }
  }
};

GMaps.Route = function (opciones) {
  this.origin = options.origin;
  this.destination = options.destination;
  this.waypoints = options.waypoints;

  this.map = options.map;
  this.route = options.route;
  this.step_count = 0;
  this.steps = this.route.legs [0] pasos.;
  this.steps_length = this.steps.length;

  this.polyline = this.map.drawPolyline ({
    path: nueva google.maps.MVCArray (),
    strokeColor: options.strokeColor,
    strokeOpacity: options.strokeOpacity,
    strokeWeight: options.strokeWeight
  }) GetPath ().;
};

GMaps.Route.prototype.getRoute = function (opciones) {
  var self = this;

  this.map.getRoutes ({
    origen: this.origin,
    destino: this.destination,
    travelMode: options.travelMode,
    waypoints: this.waypoints | | [],
    error: options.error,
    callback: function () {
      self.route = e [0];

      si (options.callback) {
        options.callback.call (auto-);
      }
    }
  });
};

GMaps.Route.prototype.back = function () {
  si (this.step_count> 0) {
    this.step_count--;
    var path = this.route.legs [0] pasos [this.step_count] path..;

    for (var p en ruta) {
      si (path.hasOwnProperty (p)) {
        this.polyline.pop ();
      }
    }
  }
};

GMaps.Route.prototype.forward = function () {
  si (this.step_count <this.steps_length) {
    var path = this.route.legs [0] pasos [this.step_count] path..;

    for (var p en ruta) {
      si (path.hasOwnProperty (p)) {
        this.polyline.push (ruta [p]);
      }
    }
    this.step_count + +;
  }
};

GMaps.prototype.checkGeofence = function (lat, lng, valla) {
  volver fence.containsLatLng (nueva google.maps.LatLng (lat, lng));
};

GMaps.prototype.checkMarkerGeofence = function (marcador, outside_callback) {
  if () {marker.fences
    for (var i = 0, valla, valla = marker.fences [i]; i + +) {
      pos var = marker.getPosition ();
      if (! this.checkGeofence (pos.lat (), pos.lng (), valla)) {
        outside_callback (marcador, valla);
      }
    }
  }
};

GMaps.prototype.toImage = function (opciones) {
  var options = Opciones | | {},
      static_map_options = {};

  static_map_options ['size'] = options ['size'] | | [this.el.clientWidth, this.el.clientHeight];
  . static_map_options ['lat'] = this.getCenter () lat ();
  static_map_options ['lng'] = this.getCenter () lng ().;

  si (this.markers.length> 0) {
    static_map_options ['marcadores'] = [];
    
    for (var i = 0; i <this.markers.length; i + +) {
      static_map_options ['marcadores']. push ({
        lat:.. this.markers [i] GetPosition () lat (),
        lng:.. this.markers [i] getPosition () lng ()
      });
    }
  }

  si (this.polylines.length> 0) {
    polilínea var = this.polylines [0];
    
    static_map_options ['polilínea'] = {};
    static_map_options ['polilínea'] ['path'] = google.maps.geometry.encoding.encodePath (polyline.getPath ());
    static_map_options ['polilínea'] ['strokeColor'] = polyline.strokeColor
    static_map_options ['polilínea'] ['strokeOpacity'] = polyline.strokeOpacity
    static_map_options ['polilínea'] ['strokeWeight'] = polyline.strokeWeight
  }

  volver GMaps.staticMapURL (static_map_options);
};

GMaps.staticMapURL = function (opciones) {
  parámetros var = [],
      datos,
      static_root = 'http://maps.googleapis.com/maps/api/staticmap';

  si (options.url) {
    static_root = options.url;
    eliminar options.url;
  }

  static_root + = '';

  marcadores var = options.markers;
  
  eliminar options.markers;

  if (! marcadores && options.marker) {
    Marcadores = [options.marker];
    eliminar options.marker;
  }

  estilos var = options.styles;

  eliminar options.styles;

  polilínea var = options.polyline;
  eliminar options.polyline;

  / ** Opciones de mapa ** /
  si (options.center) {
    parameters.push ("centro = '+ options.center);
    eliminar options.center;
  }
  else if (options.address) {
    parameters.push ("centro = '+ options.address);
    eliminar options.address;
  }
  else if (options.lat) {
    parameters.push (. ['centro =', options.lat, ',', options.lng] join (''));
    eliminar options.lat;
    eliminar options.lng;
  }
  else if (options.visible) {
    var visible = encodeURI (options.visible.join ('|'));
    parameters.push ('visible =' + visible);
  }

  Tamaño var = options.size;
  si (tamaño) {
    si (size.join) {
      size = size.join ('x');
    }
    eliminar options.size;
  }
  else {
    size = '630x300 ';
  }
  parameters.push ("size =" + tamaño);

  if (! options.zoom && options.zoom! == false) {
    options.zoom = 15;
  }

  sensor var = options.hasOwnProperty ('sensor')? ¡Options.sensor: true;
  eliminar options.sensor;
  parameters.push ('sensor =' + sensor);

  for (var param en opciones) {
    if (options.hasOwnProperty (param)) {
      parameters.push (param + '=' Opciones + [param]);
    }
  }

  / ** Marcadores ** /
  si (marcadores) {
    marcador var, loc;

    for (var i = 0; data = marcadores [i]; i + +) {
      MP = [];

      if (data.size && data.size! == "normal") {
        marker.push ('size:' + data.size);
        eliminar data.size;
      }
      else if (data.icon) {
        marker.push ('icono:' + encodeURI (data.icon));
        eliminar data.icon;
      }

      si (data.color) {
        marker.push ('color:' + data.color.replace ('#', '0 x '));
        eliminar data.color;
      }

      si (data.label) {
        marker.push ('label:'. + data.label [0] toUpperCase ());
        eliminar data.label;
      }

      loc = (data.address data.address:? data.lat + ',' + data.lng);
      eliminar data.address;
      eliminar data.lat;
      eliminar data.lng;

      for (var param en data) {
        if (data.hasOwnProperty (param)) {
          marker.push (param + ':' + datos [param]);
        }
      }

      if (marker.length | | i === 0) {
        marker.push (loc);
        MP = marker.join ('|');
        parameters.push ('marcadores =' + encodeURI (marcador));
      }
      / / Nuevo marcador sin estilos
      else {
        MP = parameters.pop () + encodeURI ('|' + loc);
        parameters.push (marcador);
      }
    }
  }

  / ** Mapa Estilos ** /
  si (estilos) {
    for (var i = 0; i <styles.length; i + +) {
      styleRule var = [];
      if (estilos [i]. FeatureType && estilos [i]. featureType! = 'all') {
        styleRule.push ('característica:'. + estilos [i] Entidad);
      }

      if (estilos [i]. elementType && estilos [i]. elementType! = 'all') {
        styleRule.push ('elemento:'. + estilos [i] elementType);
      }

      for (var j = 0; j <estilos [i] stylers.length;. j + +) {
        for (var p en estilos [i]. stylers [j]) {
          var = ruleArg estilos [i] stylers [j] [p].;
          if (p == 'matiz' | | p == 'color') {
            ruleArg = '0 x '+ ruleArg.substring (1);
          }
          styleRule.push (p + ':' + ruleArg);
        }
      }

      regla var = styleRule.join ('|');
      if (rule! ='') {
        parameters.push ('style =' + regla);
      }
    }
  }

  / ** Polilíneas ** /
  parseColor función (color, opacidad) {
    si (color [0] === '#') {
      color = color.replace ('#', '0 x ');

      if (opacidad) {
        opacidad = parseFloat (opacidad);
        opacidad = Math.min (1, Math.max (opacidad, 0));
        si (opacidad === 0) {
          volver '0 x00000000 ';
        }
        opacidad = (opacidad * 255) toString (16).;
        si (opacity.length === 1) {
          opacidad + = opacidad;
        }

        color = color.slice (0,8) + opacidad;
      }
    }
    devolver el color;
  }

  if (polilínea) {
    data = polilínea;
    polilínea = [];

    si (data.strokeWeight) {
      polyline.push ("peso: '+ parseInt (data.strokeWeight, 10));
    }

    si (data.strokeColor) {
      var color = parseColor (data.strokeColor, data.strokeOpacity);
      polyline.push ('color:' + color);
    }

    si (data.fillColor) {
      FillColor var = parseColor (data.fillColor, data.fillOpacity);
      polyline.push ('FillColor:' + FillColor);
    }

    var path = data.path;
    si (path.join) {
      for (var j = 0, pos, pos = ruta [j]; j + +) {
        polyline.push (pos.join (','));
      }
    }
    else {
      polyline.push ('enc:' + ruta de acceso);
    }

    polilínea = polyline.join ('|');
    parameters.push ('path =' + encodeURI (polilínea));
  }

  parámetros = parameters.join ('&');
  volver static_root + parámetros;
};

GMaps.prototype.addMapType = function (MapTypeId, options) {
  if (options.hasOwnProperty ("getTileUrl") && typeof (opciones ["getTileUrl"]) "función" ==) {
    options.tileSize = options.tileSize | | nueva google.maps.Size (256, 256);

    mapType var = new google.maps.ImageMapType (opciones);

    this.map.mapTypes.set (MapTypeId, mapType);
  }
  else {
    tirar "función" getTileUrl 'necesario. ";
  }
};

GMaps.prototype.addOverlayMapType = function (opciones) {
  if (options.hasOwnProperty ("GetTile") && typeof (opciones ["GetTile"]) "función" ==) {
    var overlayMapTypeIndex = options.index;

    eliminar options.index;

    this.map.overlayMapTypes.insertAt (overlayMapTypeIndex, opciones);
  }
  else {
    tirar "función" GetTile 'necesario. ";
  }
};

GMaps.prototype.removeOverlayMapType = function (overlayMapTypeIndex) {
  this.map.overlayMapTypes.removeAt (overlayMapTypeIndex);
};

GMaps.prototype.addStyle = function (opciones) {
  StyledMapType var = new google.maps.StyledMapType (options.styles, {name: options.styledMapName});

  this.map.mapTypes.set (options.mapTypeId, StyledMapType);
};

GMaps.prototype.setStyle = function (MapTypeId) {
  this.map.setMapTypeId (MapTypeId);
};

GMaps.prototype.createPanorama = function () {streetview_options
  if (streetview_options.hasOwnProperty ('lat') | |! streetview_options.hasOwnProperty ('lng')) {
    streetview_options.lat = this.getCenter () lat ().;
    streetview_options.lng = this.getCenter () de GNL ().;
  }

  this.panorama = GMaps.createPanorama (streetview_options);

  this.map.setStreetView (this.panorama);

  volver this.panorama;
};

GMaps.createPanorama = function (opciones) {
  var el = getElementById (options.el, options.context);

  options.position = new google.maps.LatLng (options.lat, options.lng);

  eliminar options.el;
  eliminar options.context;
  eliminar options.lat;
  eliminar options.lng;

  streetview_events var = ['closeclick', 'links_changed', 'pano_changed', 'position_changed', 'pov_changed', 'redimensionar', 'visible_changed'],
      streetview_options = extend_object ({visible: true}, opciones);

  for (var i = 0; i <streetview_events.length; i + +) {
    eliminar streetview_options [streetview_events [i]];
  }

  var = new panorama google.maps.StreetViewPanorama (el, streetview_options);

  for (var i = 0; i <streetview_events.length; i + +) {
    (Function (objeto, nombre) {
      if (opciones [nombre]) {
        google.maps.event.addListener (objeto, nombre, function () {
          . Opciones [nombre] aplicarse (this);
        });
      }
    }) (Panorama, streetview_events [i]);
  }

  volver panorama;
};

GMaps.prototype.on = function (EVENT_NAME, handler) {
  volver GMaps.on (EVENT_NAME, esto, handler);
};

GMaps.prototype.off = function (EVENT_NAME) {
  GMaps.off (EVENT_NAME, este);
};

GMaps.custom_events = ['marker_added', 'marker_removed', 'polyline_added', 'polyline_removed', 'polygon_added', 'polygon_removed', 'geolocalizado', 'geolocation_failed'];

GMaps.on = function (EVENT_NAME, objeto, handler) {
  if (GMaps.custom_events.indexOf (EVENT_NAME) == -1) {
    volver google.maps.event.addListener (objeto, EVENT_NAME, handler);
  }
  else {
    registered_event var = {
      manejador: manejador,
      eventName: EVENT_NAME
    };

    object.registered_events [EVENT_NAME] = object.registered_events [EVENT_NAME] | | [];
    . object.registered_events [EVENT_NAME] push (registered_event);

    volver registered_event;
  }
};

GMaps.off = function (EVENT_NAME, objeto) {
  if (GMaps.custom_events.indexOf (EVENT_NAME) == -1) {
    google.maps.event.clearListeners (objeto, EVENT_NAME);
  }
  else {
    object.registered_events [EVENT_NAME] = [];
  }
};

GMaps.fire = function (EVENT_NAME, objeto, ámbito de aplicación) {
  if (GMaps.custom_events.indexOf (EVENT_NAME) == -1) {
    google.maps.event.trigger (. objeto, EVENT_NAME, Array.prototype.slice.apply (argumentos) slice (2));
  }
  else {
    if (EVENT_NAME en scope.registered_events) {
      firing_events var = scope.registered_events [EVENT_NAME];

      for (var i = 0; i <firing_events.length; i + +) {
        (Function (manejador, el alcance, objeto) {
          handler.apply (alcance, [objeto]);
        }) (Firing_events [i] ['handler'], el alcance, objeto);
      }
    }
  }
};

GMaps.geolocate = function (opciones) {
  complete_callback var = options.always | | options.complete;

  si (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition (function (position) {
      options.success (posición);

      si (complete_callback) {
        complete_callback ();
      }
    }, La función (de error) {
      options.error (de error);

      si (complete_callback) {
        complete_callback ();
      }
    }, Options.options);
  }
  else {
    options.not_supported ();

    si (complete_callback) {
      complete_callback ();
    }
  }
};

GMaps.geocode = function (opciones) {
  this.geocoder = new google.maps.Geocoder ();
  callback var = options.callback;
  if (options.hasOwnProperty ('lat') && options.hasOwnProperty ('lng')) {
    options.latLng = new google.maps.LatLng (options.lat, options.lng);
  }

  eliminar options.lat;
  eliminar options.lng;
  eliminar options.callback;
  
  this.geocoder.geocode (opciones, función (resultados, estado) {
    devolución de llamada (resultados, estado);
  });
};

/ / ==========================
/ / Polígono containsLatLng
/ / Https://github.com/tparkin/Google-Maps-Point-in-Polygon
/ / Extensión Poygon getBounds - google-maps-extensions
/ / Http://code.google.com/p/google-maps-extensions/source/browse/google.maps.Polygon.getBounds.js
if (! google.maps.Polygon.prototype.getBounds) {
  google.maps.Polygon.prototype.getBounds = function (latLng) {
    límites var = new google.maps.LatLngBounds ();
    caminos var = this.getPaths ();
    ruta var;

    for (var p = 0, p <paths.getLength (); p + +) {
      path = paths.getAt (p);
      for (var i = 0; i <path.getLength (); i + +) {
        bounds.extend (path.getAt (i));
      }
    }

    regresar límites;
  };
}

if (! google.maps.Polygon.prototype.containsLatLng) {
  / / Polígono containsLatLng - método para determinar si un latLng está dentro de un polígono
  google.maps.Polygon.prototype.containsLatLng = function (latLng) {
    / / Excluir puntos fuera de los límites ya que no hay forma en que están en el poli
    límites var = this.getBounds ();

    if (límites! == null &&! bounds.contains (latLng)) {
      return false;
    }

    / / Punto Raycast en método del polígono
    var inPoly = false;

    . numPaths var = this.getPaths () a getLength ();
    for (var p = 0, p <numPaths; p + +) {
      var path = this.getPaths () getAt (p).;
      var NumPoints = path.getLength ();
      var j = NumPoints - 1;

      for (var i = 0; i <NumPoints; i + +) {
        var vertex1 = path.getAt (i);
        vertex2 var = path.getAt (j);

        if (vertex1.lng () <latLng.lng () && vertex2.lng ()> = latLng.lng () | | vertex2.lng () <latLng.lng () && vertex1.lng ()> = latLng.lng ()) {
          si (vertex1.lat () + (latLng.lng () - vertex1.lng ()) / (vertex2.lng () - vertex1.lng ()) * (vertex2.lat () - vertex1.lat ()) < latLng.lat ()) {
            ! inPoly = inPoly;
          }
        }

        j = i;
      }
    }

    volver inPoly;
  };
}

google.maps.LatLngBounds.prototype.containsLatLng = function (latLng) {
  volver this.contains (latLng);
};

google.maps.Marker.prototype.setFences = function () {vallas
  this.fences = cercas;
};

google.maps.Marker.prototype.addFence = function (valla) {
  this.fences.push (valla);
};

google.maps.Marker.prototype.getId = function () {
  devuelva este ['__gm_id'];
};

/ / ==========================
/ / Matriz indexOf
/ / Https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
if (! Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement / *, fromIndex * /) {
      "Use strict";
      if (esto == null) {
          throw new TypeError ();
      }
      var t = El objeto (this);
      var len = T.Length >>> 0;
      si (=== len 0) {
          return -1;
      }
      var n = 0;
      si (arguments.length> 1) {
          n = Número (argumentos [1]);
          if (n! = n) {/ / acceso directo para comprobar si se trata de NaN
              n = 0;
          } Else if (n! = 0 && n! = Infinito && n! =-Infinity) {
              n = (n> 0 | | -1) * Math.floor (Math.abs (n));
          }
      }
      if (n> = len) {
          return -1;
      }
      var k = n> = 0? N: Math.max (len - Math.abs (n), 0);
      for (; k <len; k + +) {
          if (k en t && t [k] === searchElement) {
              volver K;
          }
      }
      return -1;
  }
}