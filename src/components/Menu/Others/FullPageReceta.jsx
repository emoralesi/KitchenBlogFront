import { useParams } from "react-router-dom";
import { DetailsReceta } from "./DitailsReceta";

export const FullPageReceta = () => {
    let { idReceta } = useParams();

    return (
        <div style={{ height: '100%' }}>
            <DetailsReceta isFull={true} idReceta={idReceta} />
        </div>
    )
}