import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const revokeAIOverlay = defineStyle((props) => ({
  bg: mode('blackAlpha.700', 'blackAlpha.700')(props),
}));

const revokeAIDialogContainer = defineStyle({});

const revokeAIDialog = defineStyle(() => {
  return {
    layerStyle: 'first',
    maxH: '80vh',
  };
});

const revokeAIHeader = defineStyle(() => {
  return {
    fontWeight: '600',
    fontSize: 'lg',
    layerStyle: 'first',
    borderTopRadius: 'base',
    borderInlineEndRadius: 'base',
  };
});

const revokeAICloseButton = defineStyle({});

const revokeAIBody = defineStyle({
  overflowY: 'scroll',
});

const revokeAIFooter = defineStyle({});

export const revokeAI = definePartsStyle((props) => ({
  overlay: revokeAIOverlay(props),
  dialogContainer: revokeAIDialogContainer,
  dialog: revokeAIDialog(),
  header: revokeAIHeader(),
  closeButton: revokeAICloseButton,
  body: revokeAIBody,
  footer: revokeAIFooter,
}));

export const modalTheme = defineMultiStyleConfig({
  variants: {
    revokeAI,
  },
  defaultProps: { variant: 'revokeAI', size: 'lg' },
});
