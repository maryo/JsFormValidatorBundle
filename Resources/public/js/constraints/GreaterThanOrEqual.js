//noinspection JSUnusedGlobalSymbols
/**
 * Checks if value is greater than or equal to the predefined value
 * @constructor
 * @author dev.ymalcev@gmail.com
 */
function SymfonyComponentValidatorConstraintsGreaterThanOrEqual() {
    this.message = '';
    this.value = null;

    this.validate = function (value) {
        var f = FpJsFormValidator;
        if (f.isValueEmpty(value) || value >= this.value) {
            return [];
        } else {
            return [
                this.message
                    .replace('{{ value }}', FpJsBaseConstraint.formatValue(value))
                    .replace('{{ compared_value }}', FpJsBaseConstraint.formatValue(this.value))
            ];
        }
    }
}
