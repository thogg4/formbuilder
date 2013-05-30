# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'formbuilder/version'

Gem::Specification.new do |spec|
  spec.name          = "formbuilder"
  spec.version       = Formbuilder::VERSION
  spec.authors       = ["Tim"]
  spec.email         = ["thogg4@gmail.com"]
  spec.description   = %q{formbuilder}
  spec.summary       = %q{formbuilder}
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files = Dir["vendor/**/*.{scss,js,png}"] + Dir["lib/**/*"] + ["README.md", "LICENSE.txt"]
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.3"
  spec.add_development_dependency "rake"
end

