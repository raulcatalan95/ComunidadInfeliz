import { NavLink } from "react-router-dom";

interface CardHomeProps {
  icon: string;
  title: string;
  description: string;
  bgColor: string;
}

const CardHome = ({ icon, title, description, bgColor }: CardHomeProps) => {
  return (
        <NavLink to={`/${title.toLowerCase().replace(/\s+/g, '-')}`} className={`${bgColor} no-underline rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform duration-300 transform hover:scale-105 cursor-pointer hover:shadow-xl`}>
            <div className="rounded-full bg-white p-3 mb-4">
                <i className={`${icon} text-2xl`}></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-white text-sm text-center">{description}</p>
        </NavLink>
    );
}
export default CardHome;