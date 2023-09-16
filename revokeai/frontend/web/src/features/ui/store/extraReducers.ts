import { RevokeTabName, tabMap } from './tabMap';
import { UIState } from './uiTypes';

export const setActiveTabReducer = (
  state: UIState,
  newActiveTab: number | RevokeTabName
) => {
  if (typeof newActiveTab === 'number') {
    state.activeTab = newActiveTab;
  } else {
    state.activeTab = tabMap.indexOf(newActiveTab);
  }
};
