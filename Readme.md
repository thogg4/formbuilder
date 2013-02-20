formbuilder
==================

This project has many changes to it, but it is heavily based on the jquery.formbuilder project. (https://github.com/botskonet/jquery.formbuilder)

Changes:
-------

* There is no longer a checkbox group. Each checkbox element created is just one  checkbox.
* Rearranged defaults object:
```
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
```
* made list items optionally sortable (see defaults)
* changed controls from a select box to a list of list items
* added optional icons for control list items
* various changes to JSON that is submitted to save.url


Usage
-----

```
$('any_element').formbuilder({options_to_override_defaults})
```

I have also added a server side parser written in ruby to generate html from the json that is saved.

