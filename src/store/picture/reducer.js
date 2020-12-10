const initialState = [];

const imagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "DISPLAY_PICTURE":
      return [...state, { ...action.payload }];

    case "DISPLAY_PICTURE_FROM_FETCH":
      if (action.payload.length === 0) {
        return [...initialState];
      }
      return [...action.payload];

    case "REMOVE_PICTURE":
      return [
        ...state.filter((image) => {
          return image.id !== parseInt(action.payload);
        }),
      ];

    case "REMOVE_ALL_PICTURE":
      return initialState;

    default:
      return state;
  }
};

export default imagesReducer;
