import { defineStyle, defineStyleConfig } from '@chakra-ui/react';
import { getInputOutlineStyles } from '../util/getInputOutlineStyles';

const revokeAI = defineStyle((props) => ({
  ...getInputOutlineStyles(props),
  '::-webkit-scrollbar': {
    display: 'initial',
  },
  '::-webkit-resizer': {
    backgroundImage: `linear-gradient(135deg,
      var(--revokeai-colors-base-50) 0%,
      var(--revokeai-colors-base-50) 70%,
      var(--revokeai-colors-base-200) 70%,
      var(--revokeai-colors-base-200) 100%)`,
  },
  _disabled: {
    '::-webkit-resizer': {
      backgroundImage: `linear-gradient(135deg,
        var(--revokeai-colors-base-50) 0%,
        var(--revokeai-colors-base-50) 70%,
        var(--revokeai-colors-base-200) 70%,
        var(--revokeai-colors-base-200) 100%)`,
    },
  },
  _dark: {
    '::-webkit-resizer': {
      backgroundImage: `linear-gradient(135deg,
        var(--revokeai-colors-base-900) 0%,
        var(--revokeai-colors-base-900) 70%,
        var(--revokeai-colors-base-800) 70%,
        var(--revokeai-colors-base-800) 100%)`,
    },
    _disabled: {
      '::-webkit-resizer': {
        backgroundImage: `linear-gradient(135deg,
          var(--revokeai-colors-base-900) 0%,
          var(--revokeai-colors-base-900) 70%,
          var(--revokeai-colors-base-800) 70%,
          var(--revokeai-colors-base-800) 100%)`,
      },
    },
  },
  p: 2,
}));

export const textareaTheme = defineStyleConfig({
  variants: {
    revokeAI,
  },
  defaultProps: {
    size: 'md',
    variant: 'revokeAI',
  },
});
