import { inputAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';
import { getInputOutlineStyles } from '../util/getInputOutlineStyles';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const revokeAI = definePartsStyle((props) => {
  return {
    field: getInputOutlineStyles(props),
  };
});

export const inputTheme = defineMultiStyleConfig({
  variants: {
    revokeAI,
  },
  defaultProps: {
    size: 'sm',
    variant: 'revokeAI',
  },
});
