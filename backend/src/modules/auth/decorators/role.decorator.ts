import { SetMetadata } from '@nestjs/common';

export const IS_AUTHENTICATED_KEY = 'isAuthenticated';
export const IS_ADMIN_KEY = 'isAdmin';

export const Authenticated = () => SetMetadata(IS_AUTHENTICATED_KEY, true);
export const Admin = () => SetMetadata(IS_ADMIN_KEY, true);
