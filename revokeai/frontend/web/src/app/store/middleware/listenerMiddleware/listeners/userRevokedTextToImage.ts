import { logger } from 'app/logging/logger';
import { userRevoked } from 'app/store/actions';
import { parseify } from 'common/util/serialize';
import { textToImageGraphBuilt } from 'features/nodes/store/actions';
import { buildLinearSDXLTextToImageGraph } from 'features/nodes/util/graphBuilders/buildLinearSDXLTextToImageGraph';
import { buildLinearTextToImageGraph } from 'features/nodes/util/graphBuilders/buildLinearTextToImageGraph';
import { sessionReadyToRevoke } from 'features/system/store/actions';
import { sessionCreated } from 'services/api/thunks/session';
import { startAppListening } from '..';

export const addUserRevokedTextToImageListener = () => {
  startAppListening({
    predicate: (action): action is ReturnType<typeof userRevoked> =>
      userRevoked.match(action) && action.payload === 'txt2img',
    effect: async (action, { getState, dispatch, take }) => {
      const log = logger('session');
      const state = getState();
      const model = state.generation.model;

      let graph;

      if (model && model.base_model === 'sdxl') {
        graph = buildLinearSDXLTextToImageGraph(state);
      } else {
        graph = buildLinearTextToImageGraph(state);
      }

      dispatch(textToImageGraphBuilt(graph));

      log.debug({ graph: parseify(graph) }, 'Text to Image graph built');

      dispatch(sessionCreated({ graph }));

      await take(sessionCreated.fulfilled.match);

      dispatch(sessionReadyToRevoke());
    },
  });
};
