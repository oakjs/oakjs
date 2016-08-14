getInitialData() {
  window.data = {
    foo: "bar",
    select: "yes",
    booleanSelect: true,
    checker: true,
    yesno: "yes",
    trueUndefined: undefined,
    address: {
      street: "123 My Street",
      city: "Anytown",
      state: "Any State",
      zip: 12345,
      country: "USA"

    }
  };
  return window.data;
}
