export const binarySearch = (arr, val) => {
  let start = 0;
  let end = arr.length - 1;

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);

    if (arr[mid].symbol === val) {
      return arr[mid];
    }

    if (val < arr[mid].symbol) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }
  return null;
};

export const sortBySymbol = (a, b) => {
  if (a.symbol < b.symbol) {
    return -1;
  }
  if (a.symbol > b.symbol) {
    return 1;
  }
  return 0;
};
