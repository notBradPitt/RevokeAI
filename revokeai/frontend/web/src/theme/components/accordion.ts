import { accordionAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const revokeAIContainer = defineStyle({
  border: 'none',
});

const revokeAIButton = defineStyle((props) => {
  const { colorScheme: c } = props;
  return {
    fontWeight: '600',
    fontSize: 'sm',
    border: 'none',
    borderRadius: 'base',
    bg: mode(`${c}.200`, `${c}.700`)(props),
    color: mode(`${c}.900`, `${c}.100`)(props),
    _hover: {
      bg: mode(`${c}.250`, `${c}.650`)(props),
    },
    _expanded: {
      bg: mode(`${c}.250`, `${c}.650`)(props),
      borderBottomRadius: 'none',
      _hover: {
        bg: mode(`${c}.300`, `${c}.600`)(props),
      },
    },
  };
});

const revokeAIPanel = defineStyle((props) => {
  const { colorScheme: c } = props;
  return {
    bg: mode(`${c}.100`, `${c}.800`)(props),
    borderRadius: 'base',
    borderTopRadius: 'none',
  };
});

const revokeAIIcon = defineStyle({});

const revokeAI = definePartsStyle((props) => ({
  container: revokeAIContainer,
  button: revokeAIButton(props),
  panel: revokeAIPanel(props),
  icon: revokeAIIcon,
}));

export const accordionTheme = defineMultiStyleConfig({
  variants: { revokeAI },
  defaultProps: {
    variant: 'revokeAI',
    colorScheme: 'base',
  },
});
