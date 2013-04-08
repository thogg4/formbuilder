module Formbuilder
  class << self
    def generate_html(data)
      @html = ''
      JSON.parse(data).each { |field| build_field(field[0], field[1]) }
      return @html
    end

    def build_field(index, field)
      case field['cssClass']
      when 'input_text'
        @html += build_text_input(field)
      when 'textarea'
        @html += build_textarea(field)
      when 'checkbox'
        @html += build_checkbox(field)
      when 'radio'
        @html += build_radio(field)
      when 'select'
        @html += build_select(field)
      end
    end

    def build_text_input(f)
      s = f['required'] == 'true' ? "<label><abbr title='required'>*</abbr>#{f['title']}</label>" : "<label>#{f['title']}</label>"
      s += "<input type='text' name='custom_fields[#{nameize(f['title'])}]' />"
    end

    def build_textarea(f)
      s = f['required'] == 'true' ? "<label><abbr title='required'>*</abbr>#{f['title']}</label>" : "<label>#{f['title']}</label>"
      s += "<textarea name='custom_fields[#{nameize(f['title'])}]'></textarea>"
    end

    def build_checkbox(f)
      s = "<label class='checkbox'>"
      s += f['required'] == 'true' ? "<abbr class='required'>*</abbr>" : '' 
      s += "<input type='checkbox'#{ f['baseline'] == 'true' ? " checked='checked'" : '' } value='1' name='custom_fields[#{nameize(f['title'])}]'> #{f['title']}"
      s += "<input type='hidden' value='0' name='custom_fields[#{nameize(f['title'])}]'>"
      s += '</label>'
    end

    def build_radio(f)
      s = "<label>#{f['title']}</label>"
      f['values'].each do |v|
        attrs = v[1]
        s += "<label class='radio'>"
        s += "<input type='radio'#{ attrs['baseline'] == 'true' ? " checked='checked'" : '' } value='#{attrs['value']}' name='custom_fields[#{nameize(f['title'])}]'>  #{ attrs['value'] }"
        s += "</label>"
      end
      s
    end

    def build_select(f)
      s = "<label>#{f['title']}</label>"
      if f['multiple'] == 'true'
        s += "<select multiple='multiple' name='custom_fields[#{nameize(f['title'])}]'>"
      else
        s += "<select name='custom_fields[#{nameize(f['title'])}]'>"
      end
      f['values'].each do |v|
        attrs = v[1]
        if attrs['baseline'] == 'true'
          s += "<option value='#{attrs['value']}' selected='selected'>"
        else
          s += "<option value='#{attrs['value']}'>"
        end
        s += attrs['value']
        s += "</option>"
      end
      s += "</select>"
    end

    def nameize(string)
      string.gsub(/\s+/, "_").downcase rescue nil
    end
  end
end

