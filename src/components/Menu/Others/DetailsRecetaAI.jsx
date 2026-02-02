import CloseIcon from "@mui/icons-material/Close";
import {
    Box,
    IconButton,
    Typography,
    Zoom,
} from "@mui/material";
import RecipeFirstPart from "../ShoppingList/RecipeFirstPartAI";
import RecipeThirdPart from "../ShoppingList/RecipeThirdPartAI";

export const DetailsRecetaAI = ({
    isFull,
    setOpen,
    detailsReceta,
    origen,
    username,
    isFromProfile,
}) => {

    const handleClose = () => {
        setOpen(false);
        isFromProfile
            ? window.history.replaceState("", "", `/main/profile/${username}`)
            : window.history.replaceState("", "", `/main/${origen}`);
    };

    if (!detailsReceta) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                }}
            >
                <Typography color="text.secondary">
                    No hay receta para previsualizar.
                </Typography>
            </Box>
        );
    }

    return isFull ? (
        <>{Receta()}</>
    ) : (
        <Zoom timeout={500} in={true}>
            {Receta()}
        </Zoom>
    );

    function Receta() {
        return (
            <Box
                sx={{
                    width: isFull ? "auto" : { xs: "90vw", md: "85vw", lg: "80vw" },
                    height: isFull
                        ? "calc(100% - 4px)"
                        : { xs: "85vh", md: "85vh", lg: "90vh" },
                    bgcolor: "background.paper",
                    border: "1px solid #e0e0e0",
                    borderRadius: 4,
                    boxShadow: 5,
                    p: isFull ? 0 : { xs: 3, md: 4 },
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {!isFull && (
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            color: "grey.600",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                )}

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        width: "100%",
                        overflowY: "auto",
                        px: { xs: 2, md: 3 },
                        py: 2,
                        gap: 3,
                    }}
                >
                    <RecipeFirstPart detailsReceta={detailsReceta} />

                    <RecipeThirdPart
                        detailsReceta={detailsReceta}
                        previewMode={true}
                    />
                </Box>
            </Box>
        );
    }
};
