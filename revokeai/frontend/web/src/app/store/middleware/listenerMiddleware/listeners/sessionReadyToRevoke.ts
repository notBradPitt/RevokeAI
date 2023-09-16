import { logger } from 'app/logging/logger';
import { sessionReadyToRevoke } from 'features/system/store/actions';
import { sessionRevoked } from 'services/api/thunks/session';
import { startAppListening } from '..';

export const addSessionReadyToRevokeListener = () => {
  startAppListening({
    actionCreator: sessionReadyToRevoke,
    effect: (action, { getState, dispatch }) => {
      const log = logger('session');
      const { sessionId: session_id } = getState().system;
      if (session_id) {
        log.debug({ session_id }, `Session ready to revoke (${session_id})})`);
        dispatch(sessionRevoked({ session_id }));
      }
    },
  });
};
