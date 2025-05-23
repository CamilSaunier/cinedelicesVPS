//Dépendances
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
//CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./swipermovies.css";
// Import de la variable d'environnement
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Component du swiper d'oeuvres visible seulement sur le format téléphone et tablette
 * props motions - L'ensemble des oeuvres présentes en BDD
 */

/**------------------------------------------------------------------------------------------- 
 * Component du swiper d'oeuvres visible seulement sur le format téléphone et tablette
 * @component
 * @param motions:L'ensemble des oeuvres présentes en BDD
 * @returns Swiper d'oeuvres
/* ---------------------------------------------------------------------------------------------- */
const SwiperMovies = ({ motions }) => {
  const navigate = useNavigate();
  return (
    <>
      <Swiper
        /**Définir le foncitonnement du swiper */
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView="auto"
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        watchSlidesProgress={true}
        className="film__swiper"
        data-aos="fade-right"
      >
        {/**Affiche toutes les oeuvres */}
        {motions.map((motion, index) => (
          <SwiperSlide
            key={index}
            className="film__card"
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
            <img src={`${API_URL}/${motion.picture}`} alt={motion.title} />
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="btn btn-see-more-motions" onClick={() => navigate("/motions", { state: { motions } })}>
        Voir tous les films
      </button>
    </>
  );
};

export default SwiperMovies;
