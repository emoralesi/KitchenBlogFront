import { useParams } from "react-router-dom";
import { DetailsPost } from "./DitailsPost"

export const FullPagePost = () => {
    let { idPost } = useParams();

    return (
        <div style={{ height: '100%' }}>
            <DetailsPost isFull={true} idPost={idPost} />
        </div>
    )
}