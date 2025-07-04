"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface ProfileStats {
  activeProjects: number;
  completedProjects: number;
  activePostulations?: number;
  totalEarnings?: number;
  rating?: number;
}

export function useProfileStats(userId: string, accountType: "client" | "professional") {
  const [stats, setStats] = useState<ProfileStats>({
    activeProjects: 0,
    completedProjects: 0,
    activePostulations: 0,
    totalEarnings: 0,
    rating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      
      try {
        if (accountType === "client") {
          // Estadísticas para clientes
          const { data: projects, error } = await supabase
            .from("projects")
            .select("status")
            .eq("users_id", userId);

          if (!error && projects) {
            const activeProjects = projects.filter(p => 
              p.status === "open" || p.status === "in_progress"
            ).length;
            const completedProjects = projects.filter(p => 
              p.status === "completed"
            ).length;

            setStats({
              activeProjects,
              completedProjects,
            });
          }
        } else {
          // Estadísticas para profesionales
          // Por ahora usamos datos simulados ya que no tenemos la tabla de postulaciones implementada
          // En el futuro, aquí se harían consultas reales a la base de datos
          
          // Datos simulados más realistas
          const mockStats = {
            activeProjects: Math.floor(Math.random() * 5) + 1, // 1-5
            completedProjects: Math.floor(Math.random() * 15) + 3, // 3-17
            activePostulations: Math.floor(Math.random() * 8) + 2, // 2-9
            rating: Number((4.2 + Math.random() * 0.7).toFixed(1)), // 4.2-4.9
          };

          setStats(mockStats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId, accountType]);

  return { stats, loading };
}
