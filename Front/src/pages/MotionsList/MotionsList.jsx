import React from "react";
import "./motion_list.css";
import { useLocation, useNavigate } from "react-router-dom";

const MotionsList = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const motions = location.state?.motions || [];

  return (
    <section className="motions__section" data-aos="fade-up">
      <div className=" motions__container">
        {motions.length > 0 ? (
          motions.map((motion, index) => (
            <div
              key={index}
              className="motion__card "
              onClick={() =>
                navigate("/search-results", {
                  state: {
                    filteredRecipes: motion.recipes,
                    motion,
                    source: "motion",
                  },
                })
              }
            >
              <img src={`${API_URL}/${motion.picture}`} alt={motion.title} className="motion__img" />
            </div>
          ))
        ) : (
          <p>Aucun film à afficher.</p>
        )}
      </div>
      <button className="button-return-catalog btn" onClick={() => navigate(-1)}>
        Retourner à la page précédente
      </button>
    </section>
  );
};

export default MotionsList;
