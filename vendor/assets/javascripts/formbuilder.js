(function ($) {
  $.fn.formbuilder = function (options) {
    var defaults = {
      // must have jquery ui included to make sortable.
      sortable: false,
      save: {
        input: false,
        complete_function: function(xhr, status) {},
        success_function: function(data, status) {},
      },
      load: {
        input: false
      },
      control_box_target: false,
      save_button_target: false,
      save_button_classes: false,
      classes_of_save_buttons: false, //override this with an array of classes of buttons you want to save the form
      serialize_prefix: 'frmb',
      types: {
        text: {
          icon: '&#xe005;',
          title: 'Text Field',
          label: '',
          value: 'input_text',
          placeholder: 'Enter your question or text here'
        },
        paragraph: {
          icon: '&#xe001;',
          title: 'Paragraph Field',
          label: '',
          value: 'textarea',
          placeholder: 'Enter your question or text here'
        },
        checkbox: {
          icon: '&#xe006;',
          title: 'Checkbox',
          label: '',
          value: 'checkbox',
          placeholder: 'Enter your question or text here'
        },
        radio: {
          icon: '&#xe002;',
          title: 'Radio Group',
          label: '',
          value: 'radio',
          placeholder: 'Enter your question or text here',
          option_placeholder: 'Option'
        },
        select: {
          icon: '&#xe003;',
          title: 'Select Box',
          label: '',
          value: 'select',
          placeholder: 'Enter your question or text here',
          option_placeholder: 'Option'
        }
      },
      messages: {
        controls_label: 'Add an item',
        save: "Save",
        add_new_field: "Add New Field...",
        title: "Title",
        label: "Label",
        select_options: "Options",
        add: "Add Option",
        remove_message: "Are you sure you want to remove this element?",
        remove: "Remove",
        selections_message: "Allow Multiple Selections",
        hide: "Hide",
        required: "Required",
        show: "Show",
        checked: 'Checked'
      }
    };

    var opts = $.extend(true, defaults, options);
    var frmb_id = 'frmb-' + $('ul[id^=frmb-]').length++;

    var ul_obj = $(this).append('<ul id="' + frmb_id + '" class="frmb"></ul>').find('ul');
    var field = '',
      field_type = '',
      last_id = 1,
      help, form_db_id;

    // add a unique class to the current element
    $(ul_obj).addClass(frmb_id);

    // create form control select box and add into the editor
    var control_box = "<div class='frmb-controls'></div>"
    var controls = '';
    var save_button = '';
    var save_id = frmb_id + '-save-button';
    $.each(opts.types, function(i, t) {
      if (t.icon) {
        controls += "<li class='" + t.value + "'>" +
                      "<span data-icon='" + t.icon + "'></span>" +
                      "<div>" +
                        t.title +
                      "</div>" +
                    "</li>"
      } else {
        controls += "<li class='" + t.value + "'>" +
                      "<div>" +
                        t.title +
                      "</div>" +
                    "</li>"
      }
    });
    
    // insert the control box and its label into page
    frmbControls = $(control_box).append('<label class="controls-label">' + opts.messages.controls_label + '</label>' ).append(controls);
    if (!opts.control_box_target) {
      $(ul_obj).before(frmbControls);
    } else {
      $(opts.control_box_target).append(frmbControls);
    }

    // build the save button content
    save_button = '<input type="submit" id="' + save_id + '" class="frmb-submit ' + opts.save_button_classes + '" value="' + opts.messages.save + '"/>';
    // Insert the save button
    if (!opts.save_button_target) {
      $(ul_obj).after(save_button);
    } else {
      $(opts.save_button_target).append(save_button);
    }

    // set the form save action
    $('#' + save_id).on('click', function () {
      save();
      return false;
    });

    // add a callback to each li element
    $('.frmb-controls li').each(function() {
      $(this).on('click', function() {
        appendNewField($(this).attr('class'));
      });
    });

    // json parser to build the form builder
    var fromJson = function(json) {
      var values = '';
      var options = false;
      // Parse json
      $.each(json, function () {
        // radio type
        if (this.cssClass === 'radio') {
          values = [];
          $.each(this.values, function () {
            values.push([this.value, this.baseline]);
          });
        }
        // select type
        else if (this.cssClass === 'select') {
          values = [];
          $.each(this.values, function () {
            values.push([this.value, this.baseline]);
          });
        } else {
          values = [this.values];
        }
        options = {
          title: this.title,
          multiple: this.multiple,
          baseline: this.baseline
        }
        appendNewField(this.cssClass, values, options, this.required);
      });
    };

    // wrapper for adding a new field
    var appendNewField = function (type, values, options, required) {
      field = '';
      field_type = type;
      if (typeof (values) === 'undefined') {
        values = '';
      }
      if (typeof(options) == 'undefined') {
        options = {
          title: '',
          multiple: 'false',
          baseline: 'false'
        }
      }
      switch (type) {
        case 'input_text':
          appendTextInput(values, options, required);
          break;
        case 'textarea':
          appendTextarea(values, options, required);
          break;
        case 'checkbox':
          appendCheckbox(values, options, required);
          break;
        case 'radio':
          appendRadioGroup(values, options, required);
          break;
        case 'select':
          appendSelectList(values, options, required);
          break;
      }
    };
    // single line input type="text"
    var appendTextInput = function (values, options, required) {
      field += '<label>' + opts.types.text.label + '</label>';
      field += '<input class="fld-title" id="title-' + last_id + '" type="text" value="' + options.title + '" placeholder="' + opts.types.text.placeholder + '" />';
      help = '';
      appendFieldLi(opts.types.text.title, field, required, help);
    };
    // multi-line textarea
    var appendTextarea = function (values, options, required) {
      field += '<label>' + opts.types.paragraph.label + '</label>';
      field += '<input type="text" value="' + options.title + '" placeholder="' + opts.types.paragraph.placeholder + '" />';
      help = '';
      appendFieldLi(opts.types.paragraph.title, field, required, help);
    };
    // adds a checkbox element
    var appendCheckbox = function (values, options, required) {
      var checked = false;
      checked = options.baseline
      field += '<div class="chk_group">';
      field += '<div class="frm-fld"><label>' + opts.types.checkbox.label + '</label>';
      field += '<input type="text" name="title" value="' + options.title + '" placeholder="' + opts.types.checkbox.placeholder + '" /></div>';
      field += "<div class='frm-fld'>";
      field += '<input id="checked-' + last_id + '" class="checked" name="checked" type="checkbox"' + (checked ? ' checked="checked"' : '') + ' />';
      field += '<label for="checked-' + last_id + '">' + opts.messages.checked + '</label>';
      field += '</div>';
      help = '';
      appendFieldLi(opts.types.checkbox.title, field, required, help);
    };
    // adds a radio element
    var appendRadioGroup = function (values, options, required) {
      field += '<div class="rd_group">';
      field += '<div class="frm-fld"><label>' + opts.types.radio.label + '</label>';
      field += '<input type="text" name="title" value="' + options.title + '" placeholder="' + opts.types.radio.placeholder + '" /></div>';
      field += '<div class="false-label">' + opts.messages.select_options + '</div>';
      field += '<div class="fields">';
      if (typeof (values) === 'object') {
        for (i = 0; i < values.length; i++) {
          field += radioFieldHtml(values[i], 'frm-' + last_id + '-fld');
        }
      } else {
        field += radioFieldHtml('', 'frm-' + last_id + '-fld');
      }
      field += '<div class="add-area"><a href="#" class="add add_rd">' + opts.messages.add + '</a></div>';
      field += '</div>';
      field += '</div>';
      help = '';
      appendFieldLi(opts.types.radio.title, field, required, help);
    };
    // Radio field html, since there may be multiple
    var radioFieldHtml = function (values, name) {
      var checked = false;
      var value = '';
      if (typeof (values) === 'object') {
        value = values[0];
        checked = (values[1] === 'false' || values[1] === 'undefined') ? false : true;
      }
      field = '';
      field += '<div>';
      field += '<input type="radio"' + (checked ? ' checked="checked"' : '') + ' name="radio_' + name + '" />';
      field += '<input type="text" value="' + value + '" placeholder="' + opts.types.radio.option_placeholder + '" />';
      field += '<a href="#" class="remove" title="' + opts.messages.remove_message + '">' + opts.messages.remove + '</a>';
      field += '</div>';
      return field;
    };
    // adds a select/option element
    var appendSelectList = function (values, options, required) {
      var multiple = false;
      multiple = options.multiple === 'true'
      field += '<div class="opt_group">';
      field += '<div class="frm-fld"><label>' + opts.types.select.label + '</label>';
      field += '<input type="text" name="title" value="' + options.title + '" placeholder="' + opts.types.select.placeholder + '" /></div>';
      field += '';
      field += '<div class="false-label">' + opts.messages.select_options + '</div>';
      field += '<div class="frm-fld">';
        field += '<input class="multiple" type="checkbox" name="multiple"' + (multiple ? 'checked="checked"' : '') + '>';
        field += '<label class="">' + opts.messages.selections_message + '</label>';
      field += '</div>';
      field += '<div class="fields">';
      if (typeof (values) === 'object') {
        for (i = 0; i < values.length; i++) {
          field += selectFieldHtml(values[i], multiple);
        }
      } else {
        field += selectFieldHtml('', multiple);
      }
      field += '<div class="add-area"><a href="#" class="add add_opt">' + opts.messages.add + '</a></div>';
      field += '</div>';
      field += '</div>';
      help = '';
      appendFieldLi(opts.types.select.title, field, required, help);
    };
    var multipleSelectHtml = function (values) {
      var checked = false;
      var value = '';
      if (typeof (values) === 'object') {
        value = values[0];
        checked = (values[1] === 'false' || values[1] === 'undefined') ? false : true;
      }
      field = '';
      field += '<div>';
      field += '<input type="checkbox"' + (checked ? ' checked="checked"' : '') + ' />';
      field += '<input type="text" value="' + value + '" />';
      field += '<a href="#" class="remove" title="' + opts.messages.remove_message + '">' + opts.messages.remove + '</a>';
      field += '</div>';
      return field;
    };
    // Select field html, since there may be multiple
    var selectFieldHtml = function (values, multiple) {
      if (multiple) {
        return multipleSelectHtml(values);
      } else {
        return radioFieldHtml(values);
      }
    };
    // Appends the new field markup to the editor
    var appendFieldLi = function (title, field_html, required, help) {
      var li = '';
      li += '<li id="frm-' + last_id + '-item" class="' + field_type + '">';
      li += '<div class="legend">';
      li += '<a id="frm-' + last_id + '" class="toggle-form" href="#">' + opts.messages.hide + '</a> ';
      li += '<a id="del_' + last_id + '" class="del-button delete-confirm" href="#" title="' + opts.messages.remove_message + '"><span>' + opts.messages.remove + '</span></a>';
      li += '<strong id="txt-title-' + last_id + '">' + title + '</strong></div>';
      li += '<div id="frm-' + last_id + '-fld" class="frm-holder">';
      li += '<div class="frm-elements">';
      li += '<div>';
      li += field;
      li += '</div>';
      li += '<div class="frm-fld"><input class="required" type="checkbox" value="1" name="required-' + last_id + '" id="required-' + last_id + '"' + (required  ? ' checked="checked"' : '') + ' />';
      li += '<label for="required-' + last_id + '">' + opts.messages.required + '</label>';
      li += '</div>';
      li += '</div>';
      li += '</div>';
      li += '</li>';
      $(ul_obj).append(li);
      $('#frm-' + last_id + '-item').hide();
      $('#frm-' + last_id + '-item').animate({
        opacity: 'show',
        height: 'show'
      }, 'slow');
      last_id++;
    };
    // handle field delete links
    $('.frmb').delegate('.remove', 'click', function () {
      $(this).parent('div').animate({
        opacity: 'hide',
        height: 'hide',
        marginBottom: '0px'
      }, 'fast', function () {
        $(this).remove();
      });
      return false;
    });
    // handle field display/hide
    $('.frmb').delegate('.toggle-form', 'click', function () {
      var target = $(this).attr("id");
      if ($(this).html() === opts.messages.hide) {
        $(this).removeClass('open').addClass('closed').html(opts.messages.show);
        $('#' + target + '-fld').animate({
          opacity: 'hide',
          height: 'hide'
        }, 'slow');
        return false;
      }
      if ($(this).html() === opts.messages.show) {
        $(this).removeClass('closed').addClass('open').html(opts.messages.hide);
        $('#' + target + '-fld').animate({
          opacity: 'show',
          height: 'show'
        }, 'slow');
        return false;
      }
      return false;
    });
    // handle delete confirmation
    $('.frmb').delegate('.delete-confirm', 'click', function () {
      var delete_id = $(this).attr("id").replace(/del_/, '');
      if (confirm($(this).attr('title'))) {
        $('#frm-' + delete_id + '-item').animate({
          opacity: 'hide',
          height: 'hide',
          marginBottom: '0px'
        }, 'slow', function () {
          $(this).remove();
          save();
        });
      }
      return false;
    });
    // Attach a callback to add new options
    $('.frmb').delegate('.add_opt', 'click', function () {
      $(this).parent().before(selectFieldHtml('', false));
      return false;
    });
    // Attach a callback to add new radio fields
    $('.frmb').delegate('.add_rd', 'click', function () {
      $(this).parent().before(radioFieldHtml(false, $(this).parents('.frm-holder').attr('id')));
      return false;
    });

    $('.frmb').delegate('input', 'change keyup', function() {
      save();
    });

    // inserts the jsonized data into the input field
    var save = function () {
      if (opts.save.input) {
        $(opts.save.input).val($(ul_obj).jsonizeList());
        opts.save.success_function();
      } else {
        console.log('save.input is not set');
        console.log('here is the json form:');
        console.log($(ul_obj).jsonizeList());
      }
    };

    // load existing form data
    if (opts.load.input) {
      json = $(opts.load.input).val()
      fromJson(json == "" ? {} : JSON.parse(json));
    } else {
      console.log('load.input is not set');
      console.log('please set it so i can load a form from it')
    }

    if ($.ui && opts.sortable) {
      ul_obj.sortable({
        stop: function() { save(); }
      });
    }

  };
})(jQuery);


(function ($) {
  $.fn.jsonizeList = function(options) {
    var defaults = {}
    var opts = $.extend(true, defaults, options);
    var o = {};
    var ul = this;
    var liCount = 0;
    $(this).children().each(function() {
      var classer = $(this).attr('class');
      o[liCount] = {
        cssClass: classer,
        required: $('#' + $(this).attr('id') + ' input.required').is(':checked')
      }
      switch (classer) {
        case 'input_text':
          o[liCount]['title'] = $(this).find('input[type=text]').val();
          break;
        case 'textarea':
          o[liCount]['title'] = $(this).find('input[type=text]').val();
          break;
        case 'checkbox':
          o[liCount]['title'] = $(this).find('input[type=text]').val();
          o[liCount]['baseline'] = $(this).find('input[name=checked]').is(':checked');
          break;
        case 'radio':
          o[liCount]['values'] = {}
          $(this).find('input[type=text]').each(function(i) {
            if ($(this).attr('name') === 'title') {
              o[liCount]['title'] = $(this).val();
            } else {
              o[liCount]['values'][i] = {}
              o[liCount]['values'][i]['value'] = $(this).val();
              o[liCount]['values'][i]['baseline'] = $(this).prev().is(':checked');
            }
          });
          break;
        case 'select':
          o[liCount]['values'] = {}
          o[liCount]['multiple'] = $(this).find('input[name=multiple]').is(':checked');
          $('#' + $(this).attr('id') + ' input[type=text]').each(function(i) {
            if ($(this).attr('name') === 'title') {
              o[liCount]['title'] = $(this).val();
            } else {
              o[liCount]['values'][i] = {}
              o[liCount]['values'][i]['value'] = $(this).val();
              o[liCount]['values'][i]['baseline'] = $(this).prev().is(':checked');
            }
          });
          break;
      }
      liCount++;
    });
    return JSON.stringify(o);
  }
})(jQuery);

