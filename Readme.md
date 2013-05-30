formbuilder
==================

This project has many changes to it, but it is heavily based on the jquery.formbuilder project. (https://github.com/botskonet/jquery.formbuilder)

Changes:
-------

* There is no longer a checkbox group. Each checkbox element created is just one checkbox.
* Rearranged defaults object:

```javascript
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
```
* made list items optionally sortable (see defaults)
* changed controls from a select box to a list of list items
* added optional icons for control list items
* various changes to JSON that is submitted to save.url


Usage
-----
This is now a gem. So:
```
gem install formbuilder || gem 'formbuilder' # in Gemfile
```

CSS
```
    *= require formbuilder
```

JS
```
//= require formbuilder
```

```
$('any_element').formbuilder({options_to_override_defaults})
```
Use the `Formbuilder` class to render html from the json that the javascript generates.

Contributing
------------
1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
