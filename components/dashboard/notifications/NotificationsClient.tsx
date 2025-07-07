"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/dashboard/notifications.module.css";
import { Notification } from "@/lib/notifications/model/notification";
import { markNotificationAsReadAction, deleteNotificationAction } from "@/lib/notifications/actions/notificationActions";

interface NotificationsClientProps {
  userId: string;
  initialNotifications: Notification[];
}

export default function NotificationsClient({ userId, initialNotifications }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(initialNotifications);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [readFilter, setReadFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNotifications(initialNotifications);
    setFilteredNotifications(initialNotifications);
  }, [initialNotifications]);

  useEffect(() => {
    let filtered = notifications;

    // Filtrar por tipo
    if (typeFilter !== "all") {
      filtered = filtered.filter(notification => notification.type === typeFilter);
    }

    // Filtrar por estado de lectura
    if (readFilter === "unread") {
      filtered = filtered.filter(notification => !notification.read);
    } else if (readFilter === "read") {
      filtered = filtered.filter(notification => notification.read);
    }

    setFilteredNotifications(filtered);
  }, [notifications, typeFilter, readFilter]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setLoading(true);
      await markNotificationAsReadAction(notificationId);
      
      // Actualizar el estado local
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read: true }
            : n
        )
      );
    } catch (error: any) {
      alert(error.message || "Error al marcar como leída");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta notificación?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteNotificationAction(notificationId);
      
      // Actualizar el estado local
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error: any) {
      alert(error.message || "Error al eliminar la notificación");
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    
    if (unreadNotifications.length === 0) {
      alert("No hay notificaciones sin leer");
      return;
    }

    try {
      setLoading(true);
      
      // Marcar todas como leídas
      for (const notification of unreadNotifications) {
        await markNotificationAsReadAction(notification.id);
      }
      
      // Actualizar el estado local
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error: any) {
      alert(error.message || "Error al marcar todas como leídas");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return `Hoy ${date.toLocaleTimeString("es-MX", { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 2) {
      return `Ayer ${date.toLocaleTimeString("es-MX", { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays <= 7) {
      return `Hace ${diffDays - 1} días`;
    } else {
      return date.toLocaleDateString("es-MX", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      project_update: "Actualización de Proyecto",
      postulation_status: "Estado de Postulación",
      message: "Mensaje",
      general: "General"
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const getTypeIcon = (type: string) => {
    const typeIcons = {
      project_update: "fa-solid fa-briefcase",
      postulation_status: "fa-solid fa-user-check",
      message: "fa-solid fa-envelope",
      general: "fa-solid fa-bell"
    };
    return typeIcons[type as keyof typeof typeIcons] || "fa-solid fa-bell";
  };

  const getTypeColor = (type: string) => {
    const typeColors = {
      project_update: "var(--primary-500, #34A1DE)", // primary blue
      postulation_status: "#10b981", // green
      message: "var(--action-300, #FA896B)", // action orange
      general: "var(--grey-500, #6B7280)" // gray
    };
    return typeColors[type as keyof typeof typeColors] || "var(--grey-500, #6B7280)";
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (notifications.length === 0 && !loading) {
    return (
      <div className={styles.notificationsContainer}>
        <div className={styles.notificationsHeader}>
          <h1 className={styles.notificationsTitle}>Notificaciones</h1>
          <p className={styles.notificationsSubtitle}>
            Mantente al día con las actualizaciones de tus proyectos y postulaciones
          </p>
        </div>
        <div className={styles.notificationsEmpty}>
          <div className={styles.notificationsEmptyIcon}>
            <i className="fa-regular fa-bell"></i>
          </div>
          <h3>No tienes notificaciones</h3>
          <p>Aquí aparecerán las actualizaciones de tus proyectos y postulaciones.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.notificationsContainer}>
      <div className={styles.notificationsHeader}>
        <h1 className={styles.notificationsTitle}>Notificaciones</h1>
        <p className={styles.notificationsSubtitle}>
          Mantente al día con las actualizaciones de tus proyectos y postulaciones
        </p>
      </div>

      {/* Estadísticas y acciones */}
      <div className={styles.notificationsStats}>
        <div className={styles.notificationStatCard}>
          <div className={styles.notificationStatNumber}>{notifications.length}</div>
          <div className={styles.notificationStatLabel}>Total</div>
        </div>
        <div className={styles.notificationStatCard}>
          <div className={styles.notificationStatNumber}>{unreadCount}</div>
          <div className={styles.notificationStatLabel}>Sin leer</div>
        </div>
        <div className={styles.notificationStatCard}>
          <div className={styles.notificationStatNumber}>{notifications.length - unreadCount}</div>
          <div className={styles.notificationStatLabel}>Leídas</div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className={styles.markAllReadButton}
            disabled={loading}
          >
            <i className="fa-solid fa-check-double"></i>
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className={styles.notificationsFilters}>
        <div className={styles.notificationFilterGroup}>
          <label htmlFor="type-filter" className={styles.notificationFilterLabel}>
            Filtrar por tipo:
          </label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={styles.notificationFilterSelect}
          >
            <option value="all">Todos los tipos</option>
            <option value="project_update">Actualizaciones de Proyecto</option>
            <option value="postulation_status">Estados de Postulación</option>
            <option value="message">Mensajes</option>
            <option value="general">General</option>
          </select>
        </div>
        
        <div className={styles.notificationFilterGroup}>
          <label htmlFor="read-filter" className={styles.notificationFilterLabel}>
            Estado de lectura:
          </label>
          <select
            id="read-filter"
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            className={styles.notificationFilterSelect}
          >
            <option value="all">Todas</option>
            <option value="unread">Sin leer</option>
            <option value="read">Leídas</option>
          </select>
        </div>
      </div>

      {/* Lista de notificaciones */}
      {filteredNotifications.length === 0 ? (
        <div className={styles.notificationsEmpty}>
          <div className={styles.notificationsEmptyIcon}>
            <i className="fa-solid fa-filter"></i>
          </div>
          <h3>No hay notificaciones con estos filtros</h3>
          <p>Prueba ajustando los filtros para ver más resultados.</p>
        </div>
      ) : (
        <div className={styles.notificationsList}>
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`${styles.notificationCard} ${!notification.read ? styles.unread : ''}`}
            >
              <div className={styles.notificationHeader}>
                <div className={styles.notificationInfo}>
                  <div 
                    className={styles.notificationTypeIcon}
                    style={{ backgroundColor: getTypeColor(notification.type) }}
                  >
                    <i className={getTypeIcon(notification.type)}></i>
                  </div>
                  <div className={styles.notificationDetails}>
                    <h3>{notification.title}</h3>
                    <span className={styles.notificationTypeLabel}>
                      {getTypeLabel(notification.type)}
                    </span>
                  </div>
                </div>
                <div className={styles.notificationMeta}>
                  {!notification.read && (
                    <span className={styles.notificationUnreadBadge}></span>
                  )}
                  <span className={styles.notificationDate}>
                    {formatDate(notification.created_at)}
                  </span>
                </div>
              </div>

              <div className={styles.notificationContent}>
                <p className={styles.notificationMessage}>
                  {notification.message}
                </p>
              </div>

              <div className={styles.notificationActions}>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className={`${styles.notificationButton} ${styles.markReadButton}`}
                    disabled={loading}
                  >
                    <i className="fa-solid fa-check"></i>
                    Marcar como leída
                  </button>
                )}
                
                {notification.action_url && (
                  <Link
                    href={notification.action_url}
                    className={`${styles.notificationButton} ${styles.actionButton}`}
                  >
                    <i className="fa-solid fa-external-link-alt"></i>
                    Ver detalles
                  </Link>
                )}
                
                <button
                  onClick={() => handleDelete(notification.id)}
                  className={`${styles.notificationButton} ${styles.deleteButton}`}
                  disabled={loading}
                >
                  <i className="fa-solid fa-trash"></i>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
