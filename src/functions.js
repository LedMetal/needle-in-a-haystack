export const hideDiv = element => {
  element.style.setProperty('display', 'none');
  element.style.setProperty('visibility', 'hidden');
};

export const showDiv = element => {
  element.style.setProperty('display', 'inline-block');
  element.style.setProperty('visibility', 'visible');
};
