// TODO: Restore variations
// Support code from v2.3 in here.

// export const stringToSeedWeights = (
//   string: string
// ): RevokeAI.SeedWeights | boolean => {
//   const stringPairs = string.split(',');
//   const arrPairs = stringPairs.map((p) => p.split(':'));
//   const pairs = arrPairs.map((p: Array<string>): RevokeAI.SeedWeightPair => {
//     return { seed: Number(p[0]), weight: Number(p[1]) };
//   });

//   if (!validateSeedWeights(pairs)) {
//     return false;
//   }

//   return pairs;
// };

// export const validateSeedWeights = (
//   seedWeights: RevokeAI.SeedWeights | string
// ): boolean => {
//   return typeof seedWeights === 'string'
//     ? Boolean(stringToSeedWeights(seedWeights))
//     : Boolean(
//         seedWeights.length &&
//           !seedWeights.some((pair: RevokeAI.SeedWeightPair) => {
//             const { seed, weight } = pair;
//             const isSeedValid = !isNaN(parseInt(seed.toString(), 10));
//             const isWeightValid =
//               !isNaN(parseInt(weight.toString(), 10)) &&
//               weight >= 0 &&
//               weight <= 1;
//             return !(isSeedValid && isWeightValid);
//           })
//       );
// };

// export const seedWeightsToString = (
//   seedWeights: RevokeAI.SeedWeights
// ): string => {
//   return seedWeights.reduce((acc, pair, i, arr) => {
//     const { seed, weight } = pair;
//     acc += `${seed}:${weight}`;
//     if (i !== arr.length - 1) {
//       acc += ',';
//     }
//     return acc;
//   }, '');
// };

// export const seedWeightsToArray = (
//   seedWeights: RevokeAI.SeedWeights
// ): Array<Array<number>> => {
//   return seedWeights.map((pair: RevokeAI.SeedWeightPair) => [
//     pair.seed,
//     pair.weight,
//   ]);
// };

// export const stringToSeedWeightsArray = (
//   string: string
// ): Array<Array<number>> => {
//   const stringPairs = string.split(',');
//   const arrPairs = stringPairs.map((p) => p.split(':'));
//   return arrPairs.map(
//     (p: Array<string>): Array<number> => [parseInt(p[0], 10), parseFloat(p[1])]
//   );
// };

export default {};
