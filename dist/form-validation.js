"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateDayValidation = exports.NumberRangeValidation = exports.WholeNumberValidation = void 0;
class WholeNumberValidation {
    constructor(prompt) {
        this.prompt = prompt;
    }
    validate(value) {
        const num = parseFloat(value);
        // Check to see we have no (or very small fractional component)
        if (num % 1 > 1e-8) {
            return this.prompt || `Please specify a whole number.`;
        }
    }
}
exports.WholeNumberValidation = WholeNumberValidation;
class NumberRangeValidation {
    constructor(min, max, prompt) {
        this.min = min;
        this.max = max;
        this.prompt = prompt;
    }
    validate(value) {
        const num = parseFloat(value);
        if (this.min && this.max && (num < this.min || this.max < num)) {
            return this.prompt || `Please specify a value between ${this.min} and ${this.max}.`;
        }
        if (this.min && num < this.min) {
            return this.prompt || `Please specify a value greater than or equal to ${this.min}.`;
        }
        if (this.max && num > this.max) {
            return this.prompt || `Please specify a value less than or equal to ${this.max}.`;
        }
    }
}
exports.NumberRangeValidation = NumberRangeValidation;
const getLocalDate = (date, timeZone) => {
    const localDateTime = new Date(date.toLocaleString('en-US', { timeZone }));
    return new Date(localDateTime.getFullYear(), localDateTime.getMonth(), localDateTime.getDate());
};
class DateDayValidation {
    constructor(startWithin, endWithin, prompt) {
        // TODO: Consider adding support for ISO-8601 durations instead of +/- days
        // see: https://developer.amazon.com/en-US/docs/alexa/custom-skills/slot-type-reference.html
        this.startWithin = startWithin;
        this.endWithin = endWithin;
        this.prompt = prompt;
    }
    validate(value, user) {
        const m = value.match(/^\d{4}-\d{2}-\d{2}$/); // Validate YYYY-MM-DD
        if (!m) {
            return this.prompt || 'Please provide a specific date.  For what day?';
        }
        // Check date within days based on user timezone
        const timeZone = user && user.timeZone || 'utc';
        const date = getLocalDate(new Date(value), timeZone);
        const today = getLocalDate(new Date(), timeZone);
        const days = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        console.log(`date: ${date}, today: ${today}, diff: ${days}`);
        if (days < -this.startWithin) {
            return this.prompt || `Date must start within ${this.startWithin} days. For What day?`;
        }
        else if (days > this.endWithin) {
            return this.prompt || `Date must end within ${this.endWithin} days. For What day?`;
        }
        return undefined;
    }
}
exports.DateDayValidation = DateDayValidation;
//# sourceMappingURL=form-validation.js.map