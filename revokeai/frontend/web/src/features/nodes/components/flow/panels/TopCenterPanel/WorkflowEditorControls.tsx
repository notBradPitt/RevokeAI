import { Flex } from '@chakra-ui/react';
import CancelButton from 'features/parameters/components/ProcessButtons/CancelButton';
import RevokeButton from 'features/parameters/components/ProcessButtons/RevokeButton';
import { memo } from 'react';

const WorkflowEditorControls = () => {
  return (
    <Flex layerStyle="first" sx={{ gap: 2, borderRadius: 'base', p: 2 }}>
      <RevokeButton />
      <CancelButton />
    </Flex>
  );
};

export default memo(WorkflowEditorControls);
