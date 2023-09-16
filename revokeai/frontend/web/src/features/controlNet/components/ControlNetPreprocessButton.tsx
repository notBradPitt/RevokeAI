import IAIButton from 'common/components/IAIButton';
import { memo, useCallback } from 'react';
import { ControlNetConfig } from '../store/controlNetSlice';
import { useAppDispatch } from 'app/store/storeHooks';
import { controlNetImageProcessed } from '../store/actions';
import { useIsReadyToRevoke } from 'common/hooks/useIsReadyToRevoke';

type Props = {
  controlNet: ControlNetConfig;
};

const ControlNetPreprocessButton = (props: Props) => {
  const { controlNetId, controlImage } = props.controlNet;
  const dispatch = useAppDispatch();
  const isReady = useIsReadyToRevoke();

  const handleProcess = useCallback(() => {
    dispatch(
      controlNetImageProcessed({
        controlNetId,
      })
    );
  }, [controlNetId, dispatch]);

  return (
    <IAIButton
      size="sm"
      onClick={handleProcess}
      isDisabled={Boolean(!controlImage) || !isReady}
    >
      Preprocess
    </IAIButton>
  );
};

export default memo(ControlNetPreprocessButton);
