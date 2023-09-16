import { AppFeature, SDFeature } from 'app/types/revokeai';
import { RootState } from 'app/store/store';
import { useAppSelector } from 'app/store/storeHooks';
import { useMemo } from 'react';
import { RevokeTabName } from 'features/ui/store/tabMap';

export const useFeatureStatus = (
  feature: AppFeature | SDFeature | RevokeTabName
) => {
  const disabledTabs = useAppSelector(
    (state: RootState) => state.config.disabledTabs
  );

  const disabledFeatures = useAppSelector(
    (state: RootState) => state.config.disabledFeatures
  );

  const disabledSDFeatures = useAppSelector(
    (state: RootState) => state.config.disabledSDFeatures
  );

  const isFeatureDisabled = useMemo(
    () =>
      disabledFeatures.includes(feature as AppFeature) ||
      disabledSDFeatures.includes(feature as SDFeature) ||
      disabledTabs.includes(feature as RevokeTabName),
    [disabledFeatures, disabledSDFeatures, disabledTabs, feature]
  );

  const isFeatureEnabled = useMemo(
    () =>
      !(
        disabledFeatures.includes(feature as AppFeature) ||
        disabledSDFeatures.includes(feature as SDFeature) ||
        disabledTabs.includes(feature as RevokeTabName)
      ),
    [disabledFeatures, disabledSDFeatures, disabledTabs, feature]
  );

  return { isFeatureDisabled, isFeatureEnabled };
};
