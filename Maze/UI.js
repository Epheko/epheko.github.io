$(function() {
    $('#slider').slider({
      min: 9,
      max: 21,
      step: 2,
      value: 9,
      change: function(e, ui) {
        $('#count').val(ui.value);
      },
      create: function(e, ui) {
        $('#count').val($(this).slider('option', 'value'));
      }
    });
  });