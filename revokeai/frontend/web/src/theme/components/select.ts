import { selectAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';
import { getInputOutlineStyles } from '../util/getInputOutlineStyles';
import { mode } from '@chakra-ui/theme-tools';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const revokeAIIcon = defineStyle((props) => {
  return {
    color: mode('base.200', 'base.300')(props),
  };
});

const revokeAIField = defineStyle((props) => ({
  fontWeight: '600',
  ...getInputOutlineStyles(props),
}));

const revokeAI = definePartsStyle((props) => {
  return {
    field: revokeAIField(props),
    icon: revokeAIIcon(props),
  };
});

export const selectTheme = defineMultiStyleConfig({
  variants: {
    revokeAI,
  },
  defaultProps: {
    size: 'sm',
    variant: 'revokeAI',
  },
});
