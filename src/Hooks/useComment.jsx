import { enqueueSnackbar } from "notistack";
import { saveComment, saveUpdateReactionComment } from "../services/CommentService";

export const useComment = () => {
    const guardarComment = async ({ comentario }) => {

        try {
            const result = await saveComment({ comment: comentario });
            enqueueSnackbar('Comentario Registrado correctaente', { variant: 'success' });
            return result.comment._id;

        } catch (error) {
            console.log("mi error", error);
            enqueueSnackbar('A ocurrido un error, favor intente mas tarde (guardarComment)', { variant: 'error' });
            return false;
        } finally {
        }

    }
    const SaveUpdateCommentReaction = async ({ body }) => {

        try {
            const result = await saveUpdateReactionComment(body);
        } catch (error) {
            console.log(error);
        } finally {
        }

    }

    return { guardarComment, SaveUpdateCommentReaction }

}