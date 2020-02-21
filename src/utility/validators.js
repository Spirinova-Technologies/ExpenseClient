const validators = {
    email: {
        presence: {
            allowEmpty: false,
            message: '^Please enter an email address'
        },
        email: {
            message: '^Please enter a valid email address'
        }
    },
    password: {
        presence: {
            allowEmpty: false,
            message: '^Please enter a password'
        },
        length: {
            minimum: 5,
            message: '^Your password must be at least 5 characters'
        }
    },
    name: {
        presence: {
            allowEmpty: false,
            message: '^Name is required'
        }
    },
    phone: {
        presence: {
            allowEmpty: false,
            message: '^Contact no is required'
        },
        length: {
            minimum: 10,
            maximum: 12,
            tooLong: '^Contact no is to long',
            tooShort: "needs to have %{count} words or more",
        }
    },
    required: {
        presence: {
            allowEmpty: false,
            message: '^This field is required'
        },
    },
    firstName: {
        presence: {
            allowEmpty: false,
            message: '^First Name is required'
        },
        length: {
            minimum: 3,
            maximum: 20,
            tooLong: '^First name is to long',
            tooShort: "First name is too short",
        }
    },
    lastName: {
        presence: {
            allowEmpty: false,
            message: '^Last Name is required'
        },
        length: {
            minimum: 3,
            maximum: 20,
            tooLong: '^Last Name is to long',
            tooShort: "Last Name is too short",
        }
    },
    businessName: {
        presence: {
            allowEmpty: false,
            message: '^Business Name is required'
        },
        length: {
            minimum: 3,
            maximum: 20,
            tooLong: '^Business Name is to long',
            tooShort: "Business Name is too short",
        }
    },
    lowerCase: {
        presence: {
            allowEmpty: false,
            message: '^This field is required'
        },
        format: {
            pattern: "[a-z ]+",
            // flags: "i",
            message: "^Only small letters are allowed.",
        }
    },
    gstinNumber: {
        presence: {
            allowEmpty: false,
            message: '^This field is required'
        },
        format: {
            pattern: /^([0][1-9]|[1-2][0-9]|[3][0-7])([A-Z]{5})([0-9]{4})([A-Z]{1}[1-9A-Z]{1})([Z]{1})([0-9A-Z]{1})+$/,
            // flags: "i",
            message: "^Enter GSTIN in correct format.",
        }
    }
};

export default validators;