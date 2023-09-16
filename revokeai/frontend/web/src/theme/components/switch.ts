import { switchAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const revokeAITrack = defineStyle((props) => {
  const { colorScheme: c } = props;

  return {
    bg: mode('base.300', 'base.600')(props),

    _focusVisible: {
      boxShadow: 'none',
    },
    _checked: {
      bg: mode(`${c}.400`, `${c}.500`)(props),
    },
  };
});

const revokeAIThumb = defineStyle((props) => {
  const { colorScheme: c } = props;

  return {
    bg: mode(`${c}.50`, `${c}.50`)(props),
  };
});

const revokeAI = definePartsStyle((props) => ({
  container: {},
  track: revokeAITrack(props),
  thumb: revokeAIThumb(props),
}));

export const switchTheme = defineMultiStyleConfig({
  variants: { revokeAI },
  defaultProps: {
    size: 'md',
    variant: 'revokeAI',
    colorScheme: 'accent',
  },
});
