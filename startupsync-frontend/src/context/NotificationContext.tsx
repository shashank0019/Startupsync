import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Notification } from '../types';
import { notificationService } from '../api/notificationService';
import { getWsBaseUrl, useStomp } from '../hooks/useStomp';
import { useAuth } from '../hooks/useAuth';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  loadNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const { subscribe } = useStomp({
    endpoint: `${getWsBaseUrl()}/ws/notifications`,
  });

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.content || []);
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated, loadNotifications]);

  useEffect(() => {
    const sub = subscribe('/user/queue/notifications', (body) => {
      const notification = body as Notification;
      setNotifications((prev) => [notification, ...prev]);
      if (!notification.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
    });
    return () => sub.unsubscribe();
  }, [subscribe]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => {
        const notif = prev.find((n) => n.id === notificationId);
        if (notif && !notif.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n.id !== notificationId);
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.isRead) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
};
