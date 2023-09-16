export const colorTokenToCssVar = (colorToken: string) =>
  `var(--revokeai-colors-${colorToken.split('.').join('-')})`;
