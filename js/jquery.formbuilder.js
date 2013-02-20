/**
 * jQuery Form Builder Plugin
 * Copyright (c) 2009 Mike Botsko, Botsko.net LLC (http://www.botsko.net)
 * http://www.botsko.net/blog/2009/04/jquery-form-builder-plugin/
 * Originally designed for AspenMSM, a CMS product from Trellis Development
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * Copyright notice and license must remain intact for legal use
 */ (function ($) {
  $.fn.formbuilder = function (options) {
    // Extend the configuration options with user-provided
    var defaults = {
      // must have jquery ui included to make sortable.
      sortable: false,
      save: {
        url: false,
        complete_function: function(xhr, status) {},
        data_type: 'json'
      },
      load_url: false,
      control_box_target: false,
      save_button_classes: false,
      serialize_prefix: 'frmb',
      types: {
        text: {
          icon: false,
          label: 'Text Field',
          value: 'input_text'
        },
        paragraph: {
          icon: false,
          label: 'Paragraph Field',
          value: 'textarea'
        },
        checkbox: {
          icon: false,
          label: 'Checkbox',
          value: 'checkbox'
        },
        radio: {
          icon: false,
          label: 'Radio Group',
          value: 'radio'
        },
        select: {
          icon: false,
          label: 'Select Box',
          value: 'select'
        }
      },
      messages: {
        save: "Save",
        add_new_field: "Add New Field...",
        title: "Title",
        label: "Label",
        select_options: "Select Options",
        add: "Add",
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
    return this.each(function () {
      var ul_obj = $(this).append('<ul id="' + frmb_id + '" class="frmb"></ul>').find('ul');
      if ($.ui && opts.sortable) {
        ul_obj.sortable();
      }
      var field = '',
        field_type = '',
        last_id = 1,
        help, form_db_id;
      // Add a unique class to the current element
      $(ul_obj).addClass(frmb_id);
      // load existing form data
      if (opts.load_url) {
        $.getJSON(opts.load_url, function (json) {
          fromJson(json);
        });
      }

      // Create form control select box and add into the editor
      var controlBox = function (control_box_target, save_button_classes, types) {
        var control_box = "<div class='frmb-controls'></div>"
        var controls = '';
        var save_button = '';
        var save_id = frmb_id + '-save-button';
        $.each(types, function(i, t) {
          if (t.icon) {
            controls += "<li class='" + t.value + "'>" +
                          "<img src='" + t.icon + "' />" +
                          "<div>" +
                            t.label +
                          "</div>" +
                        "</li>"
          } else {
            controls += "<li class='" + t.value + "'>" +
                          "<div>" +
                            t.label +
                          "</div>" +
                        "</li>"
          }
        });
        
        // Insert the control box into page
        frmbControls = $(control_box).append(controls);
        if (!control_box_target) {
          $(ul_obj).before(frmbControls);
        } else {
          $(control_box_target).append(frmbControls);
        }

        // Build the save button content
        save_button = '<input type="submit" id="' + save_id + '" class="frmb-submit ' + save_button_classes + '" value="' + opts.messages.save + '"/>';
        // Insert the save button
        $(ul_obj).after(save_button);
        // Set the form save action
        $('#' + save_id).click(function () {
          save();
          return false;
        });

        // Add a callback to each li element
        $('.frmb-controls li').each(function() {
          $(this).on('click', function() {
            appendNewField($(this).attr('class'));
          });
        });

      }(opts.control_box_target, opts.save_button_classes, opts.types);

      // json parser to build the form builder
      var fromJson = function (json) {
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
        field += '<label>' + opts.messages.label + '</label>';
        field += '<input class="fld-title" id="title-' + last_id + '" type="text" value="' + options.title + '" />';
        help = '';
        appendFieldLi(opts.types.text.label, field, required, help);
      };
      // multi-line textarea
      var appendTextarea = function (values, options, required) {
        field += '<label>' + opts.messages.label + '</label>';
        field += '<input type="text" value="' + options.title + '" />';
        help = '';
        appendFieldLi(opts.types.paragraph.label, field, required, help);
      };
      // adds a checkbox element
      var appendCheckbox = function (values, options, required) {
        var checked = false;
        checked = options.baseline == 'true'
        field += '<div class="chk_group">';
        field += '<div class="frm-fld"><label>' + opts.messages.title + '</label>';
        field += '<input type="text" name="title" value="' + options.title + '" /></div>';
        field += "<div class='frm-fld'>";
        field += '<label>' + opts.messages.checked + '</label>';
        field += '<input type="checkbox"' + (checked ? ' checked="checked"' : '') + ' />';
        field += '</div>';
        help = '';
        appendFieldLi(opts.types.checkbox.label, field, required, help);
      };
      // adds a radio element
      var appendRadioGroup = function (values, options, required) {
        field += '<div class="rd_group">';
        field += '<div class="frm-fld"><label>' + opts.messages.title + '</label>';
        field += '<input type="text" name="title" value="' + options.title + '" /></div>';
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
        appendFieldLi(opts.types.radio.label, field, required, help);
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
        field += '<input type="text" value="' + value + '" />';
        field += '<a href="#" class="remove" title="' + opts.messages.remove_message + '">' + opts.messages.remove + '</a>';
        field += '</div>';
        return field;
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
      // adds a select/option element
      var appendSelectList = function (values, options, required) {
        var multiple = false;
        multiple = options.multiple === 'true'
        field += '<div class="opt_group">';
        field += '<div class="frm-fld"><label>' + opts.messages.title + '</label>';
        field += '<input type="text" name="title" value="' + options.title + '" /></div>';
        field += '';
        field += '<div class="false-label">' + opts.messages.select_options + '</div>';
        field += '<div class="fields">';
        field += '<input type="checkbox" name="multiple"' + (multiple ? 'checked="checked"' : '') + '>';
        field += '<label class="auto">' + opts.messages.selections_message + '</label>';
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
        appendFieldLi(opts.types.select.label, field, required, help);
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
        li += '<div class="frm-fld"><label for="required-' + last_id + '">' + opts.messages.required + '</label>';
        li += '<input class="required" type="checkbox" value="1" name="required-' + last_id + '" id="required-' + last_id + '"' + (required === 'true' ? ' checked="checked"' : ' hello="hello"') + ' /></div>';
        li += field;
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
      // saves the serialized data to the server
      var save = function () {
        if (opts.save.url) {
          $.ajax({
            type: "POST",
            dataType: opts.save.data_type,
            url: opts.save.url,
            data: $(ul_obj).serializeFormList({
              prepend: opts.serialize_prefix
            }),
            success: function () {},
            complete: opts.save.complete_function
          });
        }
      };
    });
  };
})(jQuery);
/**
 * jQuery Form Builder List Serialization Plugin
 * Copyright (c) 2009 Mike Botsko, Botsko.net LLC (http://www.botsko.net)
 * Originally designed for AspenMSM, a CMS product from Trellis Development
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * Copyright notice and license must remain intact for legal use
 * Modified from the serialize list plugin
 * http://www.botsko.net/blog/2009/01/jquery_serialize_list_plugin/
 */
(function ($) {
  $.fn.serializeFormList = function (options) {
    // Extend the configuration options with user-provided
    var defaults = {
      prepend: 'ul',
      is_child: false,
      attributes: ['class']
    };
    var opts = $.extend(defaults, options);
    if (!opts.is_child) {
      opts.prepend = '&' + opts.prepend;
    }
    var serialStr = '';
    // Begin the core plugin
    this.each(function () {
      var ul_obj = this;
      var li_count = 0;
      var c = 1;
      $(this).children().each(function () {
        for (att = 0; att < opts.attributes.length; att++) {
          var key = (opts.attributes[att] === 'class' ? 'cssClass' : opts.attributes[att]);
          serialStr += opts.prepend + '[' + li_count + '][' + key + ']=' + encodeURIComponent($(this).attr(opts.attributes[att]));
          // append the form field values
          if (opts.attributes[att] === 'class') {
            serialStr += opts.prepend + '[' + li_count + '][required]=' + encodeURIComponent($('#' + $(this).attr('id') + ' input.required').is(':checked'));
            switch ($(this).attr(opts.attributes[att])) {
              case 'input_text':
                serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($('#' + $(this).attr('id') + ' input[type=text]').val());
                break;
              case 'textarea':
                serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($('#' + $(this).attr('id') + ' input[type=text]').val());
                break;
              case 'checkbox':
                $('#' + $(this).attr('id') + ' input[type=text]').each(function () {
                  serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($(this).val());
                  serialStr += opts.prepend + '[' + li_count + '][baseline]=' + $(this).parent().siblings('.frm-fld').find('input[type=checkbox]').is(':checked');
                });
                break;
              case 'radio':
                c = 1;
                $('#' + $(this).attr('id') + ' input[type=text]').each(function () {
                  if ($(this).attr('name') === 'title') {
                    serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($(this).val());
                  } else {
                    serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][value]=' + encodeURIComponent($(this).val());
                    serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][baseline]=' + $(this).prev().is(':checked');
                  }
                  c++;
                });
                break;
              case 'select':
                c = 1;
                serialStr += opts.prepend + '[' + li_count + '][multiple]=' + $('#' + $(this).attr('id') + ' input[name=multiple]').is(':checked');
                $('#' + $(this).attr('id') + ' input[type=text]').each(function () {
                  if ($(this).attr('name') === 'title') {
                    serialStr += opts.prepend + '[' + li_count + '][title]=' + encodeURIComponent($(this).val());
                  } else {
                    serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][value]=' + encodeURIComponent($(this).val());
                    serialStr += opts.prepend + '[' + li_count + '][values][' + c + '][baseline]=' + $(this).prev().is(':checked');
                  }
                  c++;
                });
                break;
            }
          }
        }
        li_count++;
      });
    });
    return (serialStr);
  };
})(jQuery);
