import { auth } from './firebase';

export const ADMIN_EMAILS = ["trader@example.com", "tradergoal1b@gmail.com"];

export const isAdmin = (email: string | null | undefined): boolean => {
    if (!email) return false;
    const lowerEmail = email.toLowerCase();
    return ADMIN_EMAILS.some(e => e.toLowerCase() === lowerEmail);
};

export const isCurrentUserAdmin = (): boolean => {
    return isAdmin(auth?.currentUser?.email);
};
