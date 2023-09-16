import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'app/store/store';
import { isEqual } from 'lodash-es';

import { RevokeTabName, tabMap } from './tabMap';
import { UIState } from './uiTypes';

export const activeTabNameSelector = createSelector(
  (state: RootState) => state.ui,
  (ui: UIState) => tabMap[ui.activeTab] as RevokeTabName,
  {
    memoizeOptions: {
      equalityCheck: isEqual,
    },
  }
);

export const activeTabIndexSelector = createSelector(
  (state: RootState) => state.ui,
  (ui: UIState) => ui.activeTab,
  {
    memoizeOptions: {
      equalityCheck: isEqual,
    },
  }
);

export const uiSelector = createSelector(
  (state: RootState) => state.ui,
  (ui) => ui,
  {
    memoizeOptions: {
      equalityCheck: isEqual,
    },
  }
);
