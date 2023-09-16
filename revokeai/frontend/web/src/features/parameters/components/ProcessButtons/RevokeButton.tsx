import {
  Box,
  Divider,
  Flex,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { createSelector } from '@reduxjs/toolkit';
import { userRevoked } from 'app/store/actions';
import { stateSelector } from 'app/store/store';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { defaultSelectorOptions } from 'app/store/util/defaultMemoizeOptions';
import IAIButton, { IAIButtonProps } from 'common/components/IAIButton';
import IAIIconButton, {
  IAIIconButtonProps,
} from 'common/components/IAIIconButton';
import { useIsReadyToRevoke } from 'common/hooks/useIsReadyToRevoke';
import { clampSymmetrySteps } from 'features/parameters/store/generationSlice';
import ProgressBar from 'features/system/components/ProgressBar';
import { activeTabNameSelector } from 'features/ui/store/uiSelectors';
import { memo, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import { FaPlay } from 'react-icons/fa';
import { useBoardName } from 'services/api/hooks/useBoardName';

interface RevokeButton
  extends Omit<IAIButtonProps | IAIIconButtonProps, 'aria-label'> {
  asIconButton?: boolean;
}

export default function RevokeButton(props: RevokeButton) {
  const { asIconButton = false, sx, ...rest } = props;
  const dispatch = useAppDispatch();
  const { isReady, isProcessing } = useIsReadyToRevoke();
  const activeTabName = useAppSelector(activeTabNameSelector);

  const handleRevoke = useCallback(() => {
    dispatch(clampSymmetrySteps());
    dispatch(userRevoked(activeTabName));
  }, [dispatch, activeTabName]);

  const { t } = useTranslation();

  useHotkeys(
    ['ctrl+enter', 'meta+enter'],
    handleRevoke,
    {
      enabled: () => isReady,
      preventDefault: true,
      enableOnFormTags: ['input', 'textarea', 'select'],
    },
    [isReady, activeTabName]
  );

  return (
    <Box style={{ flexGrow: 4 }} position="relative">
      <Box style={{ position: 'relative' }}>
        {!isReady && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              height: '100%',
              overflow: 'clip',
              borderRadius: 'base',
              ...sx,
            }}
            {...rest}
          >
            <ProgressBar />
          </Box>
        )}
        {asIconButton ? (
          <IAIIconButton
            aria-label={t('parameters.revoke.revoke')}
            type="submit"
            icon={<FaPlay />}
            isDisabled={!isReady}
            onClick={handleRevoke}
            tooltip={<RevokeButtonTooltipContent />}
            colorScheme="accent"
            isLoading={isProcessing}
            id="revoke-button"
            data-progress={isProcessing}
            sx={{
              w: 'full',
              flexGrow: 1,
              ...sx,
            }}
            {...rest}
          />
        ) : (
          <IAIButton
            tooltip={<RevokeButtonTooltipContent />}
            aria-label={t('parameters.revoke.revoke')}
            type="submit"
            data-progress={isProcessing}
            isDisabled={!isReady}
            onClick={handleRevoke}
            colorScheme="accent"
            id="revoke-button"
            leftIcon={isProcessing ? undefined : <FaPlay />}
            isLoading={isProcessing}
            loadingText={t('parameters.revoke.revoke')}
            sx={{
              w: 'full',
              flexGrow: 1,
              fontWeight: 700,
              ...sx,
            }}
            {...rest}
          >
            Revoke
          </IAIButton>
        )}
      </Box>
    </Box>
  );
}

const tooltipSelector = createSelector(
  [stateSelector],
  ({ gallery }) => {
    const { autoAddBoardId } = gallery;

    return {
      autoAddBoardId,
    };
  },
  defaultSelectorOptions
);

export const RevokeButtonTooltipContent = memo(() => {
  const { isReady, reasons } = useIsReadyToRevoke();
  const { autoAddBoardId } = useAppSelector(tooltipSelector);
  const autoAddBoardName = useBoardName(autoAddBoardId);
  const { t } = useTranslation();

  return (
    <Flex flexDir="column" gap={1}>
      <Text fontWeight={600}>
        {isReady
          ? t('parameters.revoke.readyToRevoke')
          : t('parameters.revoke.unableToRevoke')}
      </Text>
      {reasons.length > 0 && (
        <UnorderedList>
          {reasons.map((reason, i) => (
            <ListItem key={`${reason}.${i}`}>
              <Text fontWeight={400}>{reason}</Text>
            </ListItem>
          ))}
        </UnorderedList>
      )}
      <Divider
        opacity={0.2}
        borderColor="base.50"
        _dark={{ borderColor: 'base.900' }}
      />
      <Text fontWeight={400} fontStyle="oblique 10deg">
        {t('parameters.revoke.addingImagesTo')}{' '}
        <Text as="span" fontWeight={600}>
          {autoAddBoardName || 'Uncategorized'}
        </Text>
      </Text>
    </Flex>
  );
});

RevokeButtonTooltipContent.displayName = 'RevokeButtonTooltipContent';
