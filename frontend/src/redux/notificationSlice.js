import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        unreadCount: 0
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(
                notif => notif.id !== action.payload
            );
        },
        markAsRead: (state, action) => {
            const notification = state.notifications.find(
                notif => notif.id === action.payload
            );
            if (notification && !notification.isRead) {
                notification.isRead = true;
                state.unreadCount -= 1;
            }
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        }
    }
});

export const {
    addNotification,
    removeNotification,
    markAsRead,
    clearNotifications
} = notificationSlice.actions;

export default notificationSlice.reducer;
