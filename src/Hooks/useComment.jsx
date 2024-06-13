import { enqueueSnackbar } from "notistack";
import { saveComment } from "../services/CommentService";

export const useComment = () => {
    const guardarComment = async ({ comentario }) => {

        console.log("data al usePost", comentario);
        try {
            await saveComment({ comment: comentario });
            enqueueSnackbar('Post Registrado correctaente', { variant: 'success' });
            return true;

        } catch (error) {
            enqueueSnackbar('A ocurrido un error, favor intente mas tarde', { variant: 'error' });
            return false;
        } finally {
        }

    }

    return { guardarComment }

}