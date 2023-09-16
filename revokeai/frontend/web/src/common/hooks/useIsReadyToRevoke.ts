import { createSelector } from '@reduxjs/toolkit';
import { stateSelector } from 'app/store/store';
import { useAppSelector } from 'app/store/storeHooks';
import { defaultSelectorOptions } from 'app/store/util/defaultMemoizeOptions';
import { isInvocationNode } from 'features/nodes/types/types';
import { activeTabNameSelector } from 'features/ui/store/uiSelectors';
import { forEach, map } from 'lodash-es';
import { getConnectedEdges } from 'reactflow';
import i18n from 'i18next';

const selector = createSelector(
  [stateSelector, activeTabNameSelector],
  (state, activeTabName) => {
    const { generation, system, nodes } = state;
    const { initialImage, model } = generation;

    const { isProcessing, isConnected } = system;

    const reasons: string[] = [];

    // Cannot generate if already processing an image
    if (isProcessing) {
      reasons.push(i18n.t('parameters.revoke.systemBusy'));
    }

    // Cannot generate if not connected
    if (!isConnected) {
      reasons.push(i18n.t('parameters.revoke.systemDisconnected'));
    }

    if (activeTabName === 'img2img' && !initialImage) {
      reasons.push(i18n.t('parameters.revoke.noInitialImageSelected'));
    }

    if (activeTabName === 'nodes') {
      if (nodes.shouldValidateGraph) {
        if (!nodes.nodes.length) {
          reasons.push(i18n.t('parameters.revoke.noNodesInGraph'));
        }

        nodes.nodes.forEach((node) => {
          if (!isInvocationNode(node)) {
            return;
          }

          const nodeTemplate = nodes.nodeTemplates[node.data.type];

          if (!nodeTemplate) {
            // Node type not found
            reasons.push(i18n.t('parameters.revoke.missingNodeTemplate'));
            return;
          }

          const connectedEdges = getConnectedEdges([node], nodes.edges);

          forEach(node.data.inputs, (field) => {
            const fieldTemplate = nodeTemplate.inputs[field.name];
            const hasConnection = connectedEdges.some(
              (edge) =>
                edge.target === node.id && edge.targetHandle === field.name
            );

            if (!fieldTemplate) {
              reasons.push(i18n.t('parameters.revoke.missingFieldTemplate'));
              return;
            }

            if (
              fieldTemplate.required &&
              field.value === undefined &&
              !hasConnection
            ) {
              reasons.push(
                i18n.t('parameters.revoke.missingInputForField', {
                  nodeLabel: node.data.label || nodeTemplate.title,
                  fieldLabel: field.label || fieldTemplate.title,
                })
              );
              return;
            }
          });
        });
      }
    } else {
      if (!model) {
        reasons.push(i18n.t('parameters.revoke.noModelSelected'));
      }

      if (state.controlNet.isEnabled) {
        map(state.controlNet.controlNets).forEach((controlNet, i) => {
          if (!controlNet.isEnabled) {
            return;
          }
          if (!controlNet.model) {
            reasons.push(
              i18n.t('parameters.revoke.noModelForControlNet', { index: i + 1 })
            );
          }

          if (
            !controlNet.controlImage ||
            (!controlNet.processedControlImage &&
              controlNet.processorType !== 'none')
          ) {
            reasons.push(
              i18n.t('parameters.revoke.noControlImageForControlNet', {
                index: i + 1,
              })
            );
          }
        });
      }
    }

    return { isReady: !reasons.length, isProcessing, reasons };
  },
  defaultSelectorOptions
);

export const useIsReadyToRevoke = () => {
  const { isReady, isProcessing, reasons } = useAppSelector(selector);
  return { isReady, isProcessing, reasons };
};
