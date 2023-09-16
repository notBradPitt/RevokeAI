import { createAction } from '@reduxjs/toolkit';
import { RevokeTabName } from 'features/ui/store/tabMap';

export const userRevoked = createAction<RevokeTabName>('app/userRevoked');
