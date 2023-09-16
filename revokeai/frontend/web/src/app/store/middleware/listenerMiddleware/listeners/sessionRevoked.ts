import { logger } from 'app/logging/logger';
import { serializeError } from 'serialize-error';
import { sessionRevoked } from 'services/api/thunks/session';
import { startAppListening } from '..';

export const addSessionRevokedPendingListener = () => {
  startAppListening({
    actionCreator: sessionRevoked.pending,
    effect: () => {
      //
    },
  });
};

export const addSessionRevokedFulfilledListener = () => {
  startAppListening({
    actionCreator: sessionRevoked.fulfilled,
    effect: (action) => {
      const log = logger('session');
      const { session_id } = action.meta.arg;
      log.debug({ session_id }, `Session revoked (${session_id})`);
    },
  });
};

export const addSessionRevokedRejectedListener = () => {
  startAppListening({
    actionCreator: sessionRevoked.rejected,
    effect: (action) => {
      const log = logger('session');
      const { session_id } = action.meta.arg;
      if (action.payload) {
        const { error } = action.payload;
        log.error(
          {
            session_id,
            error: serializeError(error),
          },
          `Problem invoking session`
        );
      }
    },
  });
};
