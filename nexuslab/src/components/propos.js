import react from 'react';
import '../styles_module/propos.css';
// import Pro1 from '../image/Belief-Statement-768x226.png';
// import Pro2 from '../image/A-propos.png';
import { Link } from "react-router-dom";
// import Logo2 from '../image/logo2.png';
import 'aos/dist/aos.css';

export function Propos() {

return (
    <div className='propos'>
        <div className='header-propos'>
            <img className='logo2' 
            // src={Logo2}
             alt='' />
            <div>À propos d’Enactus</div>
             
        </div>
                <Link className="linkJoin-propos" to={"/login"}>
                      <div className='spros btn-5'>Join US</div>
                    </Link>
                    
        <div className='inside-propos'>
            <div className='text-propos'>
            <div><span>ENACTUS</span><span> MOROCCO</span></div>
            <div>
  Enactus est une ONG internationale qui œuvre dans le domaine de l’entrepreneuriat social et le développement durable. Elle a été créée en 1975, et basée à Missouri – USA .
La création d’Enactus au Maroc s’est faite en 2003 et depuis, a accompagné plus de 100 000 jeunes à s’auto-développer tout en mettant en place annuellement une moyenne de 400 projets d’entrepreneuriat social.
            </div>
            <img className='pro1' 
            // src={Pro1}
             alt='' />
            </div>
            <div className=''>
                <img className='pro2' 
                // src={Pro2}
                 alt='' />
            </div>
        </div>


    </div>


)

}