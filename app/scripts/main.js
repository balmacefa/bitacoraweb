$(document).ready(function() {
  var lista = {};
  var lastActive;
  var length;
  var activeId = 0;

  $(document).keydown(function(e) {
    switch (e.which) {
      case 37: // left
        anterior();
        break;

      case 39: // right
        siguiente();
        break;

      default:
        return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });

  function anterior() {
    var newId = activeId - 1;
    if (newId < 0) {
      newId = length - 1;
    }
    cargarInfo(getItem(newId));
  }

  function siguiente() {
    var newId = activeId + 1;
    if (newId >= length) {
      newId = 0;
    }
    cargarInfo(getItem(newId));
  }

  function categoria(categoria) {
    return '<div class=\'categoria\'><h5>' + categoria + '</h5><div class=\'divider\'></div></div>';
  }

  function item(item) {
    return '<div id=\'' + item.id + '\' class=\'img-container item\' data-overlay-text=\'' + item.titulo + '\'><img class=\'responsive-img\' src=\'' + item.img + '\'></div>'
  }

  function llenarTabla() {
    var inHTML = '';
    for (var key in lista) {
      inHTML += categoria(key);

      for (var i = 0; i < lista[key].length; i++) {
        inHTML += item(lista[key][i]);
      }
    }
    $('#lista-img').html(inHTML);

    $('.item').on('click', function(e) {
      e.preventDefault();
      cargarInfo(getItem($(this).attr('id')));
    });

    lastActive = $('#0');
    lastActive.toggleClass('active');
    cargarInfo(getItem(activeId));
  }

  function getItem(id) {
    for (var key in lista) {
      for (var i = 0; i < lista[key].length; i++) {
        if (lista[key][i].id == id) {
          return lista[key][i];
        }
      }
    }
  }

  function cargarInfo(item) {
    activeId = item.id;
    lastActive.toggleClass('active');
    lastActive = $('#' + item.id);
    lastActive.toggleClass('active');

    $('#tituloDetalle').html(item.titulo);
    $('#imgDetalle').attr('src', item.img);
    $('#textoDetalle').html(item.descripcion);

    $('#detalle').scrollTop(0);
  }

  $.ajax({
    url: 'json/conceptos.json',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      length = data.length;
      for (var i = 0; i < data.length; i++) {
        if (lista[data[i].categoria] === undefined) {
          lista[data[i].categoria] = [];
        }
        data[i].id = i;
        lista[data[i].categoria].push(data[i]);
      }
      llenarTabla();
    },
    error: function(jqXHR, textStatus, error) {
      alert('error: ' + jqXHR.responseText);
    }
  });

});
