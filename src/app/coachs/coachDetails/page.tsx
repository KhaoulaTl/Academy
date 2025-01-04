/* eslint-disable react/no-unescaped-entities */
"use client";

import { CoachType, PlayerType } from "@/types/types";
import { useEffect, useState } from "react";
import axiosInstance from "@/config/instanceAxios";

interface DetailsCoachProps {
  coach: CoachType;
  onClose: () => void;
}

const DetailsCoach: React.FC<DetailsCoachProps> = ({ coach, onClose }) => {
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [categories, setCategories] = useState<{ [id: string]: string }>({});
  const [groupedPlayers, setGroupedPlayers] = useState<{ [category: string]: PlayerType[] }>({});

  useEffect(() => {
    const fetchPlayers = async () => {
      if (coach.playerIds && coach.playerIds.length > 0) {
        try {
          const responses = await Promise.all(
            coach.playerIds.map((id) => axiosInstance.get(`players/${id}`))
          );
          const fetchedPlayers = responses.map((res) => res.data);
          setPlayers(fetchedPlayers);
        } catch (error) {
          console.error("Erreur lors de la récupération des joueurs :", error);
        }
      }
    };

    fetchPlayers();
  }, [coach]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("categories");
        const categoryMap = response.data.reduce(
          (acc: { [key: string]: string }, category: any) => {
            acc[category._id] = category.name;
            return acc;
          },
          {}
        );
        setCategories(categoryMap);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (players.length > 0 && Object.keys(categories).length > 0) {
      // Grouper les joueurs par catégorie
      const grouped = players.reduce((acc: { [category: string]: PlayerType[] }, player) => {
        const categoryIds = Array.isArray(player.categoryId) ? player.categoryId : [player.categoryId];
  
        categoryIds.forEach((categoryId: string) => {
          const categoryName = categories[categoryId] || "Catégorie inconnue";
          if (!acc[categoryName]) acc[categoryName] = [];
          acc[categoryName].push(player);
        });
  
        return acc;
      }, {});
      setGroupedPlayers(grouped);
    }
  }, [players, categories]);

  return (
    <div className="p-6 bg-white shadow rounded-md">
      <h1 className="text-xl font-bold mb-4 mt-4 text-primary">
        Détails de l'entraîneur : {coach.firstName} {coach.lastName}
      </h1>
     

      <h2 className="text-lg font-semibold mt-4">Joueurs par catégorie :</h2>
      {Object.keys(groupedPlayers).length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse mt-4 ">
            <thead>
              <tr>
                {Object.keys(groupedPlayers).map((categoryName) => (
                  <th key={categoryName} className="px-4 py-2 border-b text-left border-t border-stroke dark:border-strokedark md:px-6 2xl:px-5">{categoryName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Nous devons nous assurer que toutes les colonnes ont le même nombre de lignes */}
              {Math.max(...Object.values(groupedPlayers).map(players => players.length)) > 0 ? (
                [...Array(Math.max(...Object.values(groupedPlayers).map(players => players.length)))].map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.entries(groupedPlayers).map(([categoryName, playersInCategory]) => (
                      <td key={categoryName} className="border-b border-t border-stroke px-2 py-2.5 dark:border-strokedark md:px-6 2xl:px-5">
                        {playersInCategory[rowIndex] ? (
                          `${playersInCategory[rowIndex].firstName} ${playersInCategory[rowIndex].lastName}`
                        ) : (
                          <span>-</span> // Afficher un tiret si la ligne pour cette catégorie est vide
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={Object.keys(groupedPlayers).length} className="px-4 py-2 border-b text-center">
                    Aucun joueur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
        </div>
      ) : (
        <p>Aucun joueur trouvé.</p>
      )}
      <div>
            <button className="flex mb-4 mt-4 items-center justify-end rounded-md border border-primary px-4 py-1 text-center font-medium text-primary hover:bg-opacity-90 lg:px-4 xl:px-4" onClick={onClose}>Fermer</button>
          </div>
    </div>
  );
};

export default DetailsCoach;
