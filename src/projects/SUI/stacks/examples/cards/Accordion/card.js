getInitialData() {
  const WHAT_IS_A_DOG = `A dog is a type of domesticated animal. Known for its loyalty and faithfulness,
   it can be found as a welcome guest in many households across the world.`;

  const KINDS_OF_DOGS = `There are many breeds of dogs. Each breed varies in size and temperament.
   Owners often select a breed of dog that they find to be compatible with their own
   lifestyle and desires from a companion.`;

  const ACQUIRING_A_DOG = `Three common ways for a prospective owner to acquire a dog
   is from pet shops, private owners, or shelters.

  A pet shop may be the most convenient way to buy a dog.
   Buying a dog from a private owner allows you to assess the pedigree
   and upbringing of your dog before choosing to take it home. Lastly,
   finding your dog from a shelter, helps give a good home to a dog who
   may not find one so readily.`;

  return {
    dogStringMap: {
      "What is a dog?": WHAT_IS_A_DOG,
      "What kinds of dogs are there?": KINDS_OF_DOGS,
      "How do you acquire a dog?": ACQUIRING_A_DOG
    },

    whatIsADogTitle: <div className="title" appearance="active"><i className="dropdown icon"/>What is a dog?</div>,
    whatIsADogContent: <div className="content">{WHAT_IS_A_DOG}</div>,

    kindsOfDogsTitle: <div className="title" appearance="active"><i className="dropdown icon"/>What kinds of dogs are there?</div>,
    kindsOfDogsContent: <div className="content">{WHAT_IS_A_DOG}</div>,

    acquiringADogTitle: <div className="title" appearance="active"><i className="dropdown icon"/>How do you acquire a dog?</div>,
    acquiringADogContent: <div className="content">{ACQUIRING_A_DOG}</div>,

    dogStringArray: [
      "What is a dog",
      WHAT_IS_A_DOG,
      "What kinds of dogs are there?",
      KINDS_OF_DOGS,
      "How do you acquire a dog?",
      ACQUIRING_A_DOG
    ],


  }
}
