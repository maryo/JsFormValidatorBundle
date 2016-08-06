//noinspection JSUnusedGlobalSymbols
/**
 * Created by ymaltsev on 11/26/13.
 */
function FpJsFormValidatorBundleFormConstraintUniqueEntity() {
    this.message          = 'This value is already used.';
    this.service          = 'doctrine.orm.validator.unique';
    this.em               = null;
    this.repositoryMethod = 'findBy';
    this.fields           = [];
    this.errorPath        = null;
    this.ignoreNull       = true;
    this.entityName       = null;

    this.groups           = [];

    /**
     * @param {*} value
     * @param {FpJsFormElement} element
     */
    this.validate = function(value, element) {
        var self   = this;
        var route  = null;
        var config = FpJsFormValidator.config;
        var errorPath = this.getErrorPathElement(element);

        if (config['routing'] && config['routing']['check_unique_entity']) {
            route = config['routing']['check_unique_entity'];
        }

        if (!route) {
            return [];
        }

        var data = this.getValues(element, this.fields);

        FpJsFormValidator.ajax.sendRequest(
            route,
            {
                message:          this.message,
                service:          this.service,
                em:               this.em,
                repositoryMethod: this.repositoryMethod,
                fields:           this.fields,
                errorPath:        this.errorPath,
                ignoreNull:       this.ignoreNull ? 1 : 0,
                groups:           this.groups,

                entityName:       this.entityName,
                data:             data
            },
            function(response){
                response = JSON.parse(response);
                var errors = [];
                if (false === response) {
                    errors.push(self.message.replace('{{ value }}', data[self.fields[0]]));
                }
                FpJsFormValidator.customize(errorPath.domNode, 'showErrors', {
                    errors: errors,
                    sourceId: 'unique-entity-' + self.uniqueId
                });
                var activeElement;

                try {
                    activeElement = 'activeElement' in document ? document.activeElement : document.querySelector(':focus');
                } catch (e) {}

                if (!('focus' in element)) {
                    return [];
                }

                if (
                    !activeElement
                    || !activeElement.form
                    || activeElement.form !== element.form
                    || activeElement.getAttribute('type') === 'submit'
                    || activeElement.tagName.toLowerCase() === 'button'
                ) {
                    element.focus();
                }
            }
        );

        return [];
    };

    this.onCreate = function() {
        if (typeof this.fields === 'string') {
            this.fields = [this.fields];
        }
    };

    /**
     * @param {FpJsFormElement} element
     * @param {Array} fields
     * @returns {{}}
     */
    this.getValues = function(element, fields) {
        var value;
        var result = {};
        for (var i = 0; i < fields.length; i++) {
            value = FpJsFormValidator.getElementValue(element.children[this.fields[i]]);
            value = value ? value : '';
            result[fields[i]] = value;
        }

        return result;
    };

    /**
     * @param {FpJsFormElement} element
     * @return {FpJsFormElement}
     */
    this.getErrorPathElement = function(element) {
        var errorPath = this.fields[0];
        if (this.errorPath) {
            errorPath = this.errorPath;
        }

        return element.children[errorPath];
    }
}
