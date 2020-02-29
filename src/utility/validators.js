const validators = {
  email: {
    presence: {
      allowEmpty: false,
      message: "^Please enter an email address"
    },
    email: {
      message: "^Please enter a valid email address"
    }
  },
  password: {
    presence: {
      allowEmpty: false,
      message: "^Please enter a password"
    },
    length: {
      minimum: 3,
      maximum: 25,
      message:
        "^Your password must be at least 3 characters and max 25 characters"
    }
  },
  name: {
    presence: {
      allowEmpty: false,
      message: "^This field is required"
    },
    format: {
      pattern: /^[a-zA-Z0-9]+$/,
      // flags: "i",
      message: "^This field must be alphanumeric."
    }
  },
  alphanumericSpace: {
    presence: {
      allowEmpty: false,
      message: "^This field is required"
    },
    format: {
      pattern: /^[a-zA-Z0-9 ]+$/,
      // flags: "i",
      message: "^This field must be alphanumeric."
    }
  },
  phone: {
    presence: {
      allowEmpty: false,
      message: "^Contact no is required"
    },
    format: {
      pattern: /^[0-9]+$/,
      // flags: "i",
      message: "^This field must be numeric."
    },
    length: {
      minimum: 10,
      maximum: 12,
      tooLong: "^Phone number can be maximum 10 digits",
      tooShort: "^Phone number needs to have minimum 10 digits"
    }
  },
  required: {
    presence: {
      allowEmpty: false,
      message: "^This field is required"
    }
  },
  firstName: {
    presence: {
      allowEmpty: false,
      message: "^First Name is required"
    },
    format: {
      pattern: /^[a-zA-Z ]+$/,
      // flags: "i",
      message: "^Firstname must be alphabetic."
    },
    length: {
      minimum: 3,
      maximum: 20,
      tooLong: "^First name is to long",
      tooShort: "^First name is to short"
    }
  },
  numeric: {
    presence: {
      allowEmpty: false,
      message: "^This field is required"
    },
    format: {
      pattern: /^[0-9]+$/,
      // flags: "i",
      message: "^This field must be numeric."
    }
  },
  amount: {
    presence: {
      allowEmpty: false,
      message: "^This field is required"
    },
    format: {
      pattern: /^[0-9]+$/,
      // flags: "i",
      message: "^This field must be in amount."
    }
  },
  lastName: {
    presence: {
      allowEmpty: false,
      message: "^Last Name is required"
    },
    format: {
      pattern: /^[a-zA-Z ]+$/,
      // flags: "i",
      message: "^Lastname must be alphabetic."
    },
    length: {
      minimum: 3,
      maximum: 20,
      tooLong: "^Last Name is to long",
      tooShort: "^Last Name is to short"
    }
  },
  businessName: {
    presence: {
      allowEmpty: false,
      message: "^Business Name is required"
    },
    length: {
      minimum: 3,
      maximum: 20,
      tooLong: "^Business Name is to long",
      tooShort: "^Business Name is to short"
    }
  },
  lowerCase: {
    presence: {
      allowEmpty: false,
      message: "^This field is required"
    },
    format: {
      pattern: "[a-z ]+",
      // flags: "i",
      message: "^Only small letters are allowed."
    }
  },
  gstinNumber: {
    presence: {
      allowEmpty: false,
      message: "^This field is required"
    },
    format: {
      pattern: /^([0][1-9]|[1-2][0-9]|[3][0-7])([A-Z]{5})([0-9]{4})([A-Z]{1}[1-9A-Z]{1})([Z]{1})([0-9A-Z]{1})+$/,
      // flags: "i",
      message: "^Enter GSTIN in correct format."
    }
  }
};

export default validators;
