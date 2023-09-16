import { progressAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const revokeAIFilledTrack = defineStyle((_props) => ({
  bg: 'accentAlpha.700',
}));

const revokeAITrack = defineStyle((_props) => {
  const { colorScheme: c } = _props;
  return {
    bg: mode(`${c}.200`, `${c}.700`)(_props),
  };
});

const revokeAI = definePartsStyle((props) => ({
  filledTrack: revokeAIFilledTrack(props),
  track: revokeAITrack(props),
}));

export const progressTheme = defineMultiStyleConfig({
  variants: {
    revokeAI,
  },
  defaultProps: {
    variant: 'revokeAI',
  },
});
