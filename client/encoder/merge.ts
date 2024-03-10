export default (pcode1: number[][], pcode2: number[][]): void => {
  if (pcode1.length === 0) {
    // add all pcode2 lines to pcode1
    pcode1.push(...pcode2);
  } else {
    const last1 = pcode1[pcode1.length - 1];
    const first2 = pcode2.shift();
    // add first line of pcode2 to end of last line of pcode1
    if (first2) last1.push(...first2);
    // add other lines of pcode2 to pcode1
    pcode1.push(...pcode2);
  }
}

// export default (pcode1: number[][], pcode2: number[][]): number[][] =>
//   pcode1.length === 0
//     ? [...pcode2]
//     : pcode2.length === 0
//     ? [...pcode1]
//     : [
//         ...pcode1.slice(0, -1),
//         [...pcode1[pcode1.length - 1], ...pcode2[0]],
//         ...pcode2.slice(1),
//       ];
