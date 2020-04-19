# Workaround for broken export live binding happyeing only in the Sandbox
babel --plugins=@babel/plugin-transform-modules-commonjs node_modules/carbon-custom-elements/es/globals/shared-enums.js > node_modules/carbon-custom-elements/es/globals/shared-enums.js.new
mv node_modules/carbon-custom-elements/es/globals/shared-enums.js.new node_modules/carbon-custom-elements/es/globals/shared-enums.js
