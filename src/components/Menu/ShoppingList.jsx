import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { Box, Button, Checkbox, IconButton, Modal, Zoom } from "@mui/material";
import { useEffect, useState } from "react";
import { useUsuario } from "../../Hooks/useUsuario";
import { getStorageUser } from "../../utils/StorageUser";
import { DetailsReceta } from "./Seccion/DitailsReceta";

export const ShoppingList = () => {
  const { ObtenerFavourites, favourites } = useUsuario();
  const [openReceta, setOpenReceta] = useState(false);
  const [userId, setUserId] = useState("");
  const [idReceta, setIdReceta] = useState(null);
  const [idSelected, setidSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [previousLength, setPreviousLength] = useState(0);

  useEffect(() => {
    ObtenerFavourites({
      data: { data: { idUser: getStorageUser().usuarioId, page, limit } },
    });
  }, []);

  return (
    <div>
      <h1>SELECT YOUR SHOPPING LIST</h1>
      <Box
        sx={{
            display: "grid",
            gap: "15px",
            gridTemplateColumns: {
              xs: "1fr", // mobile: 1 item por fila
              sm: "repeat(2, 1fr)", // pantallas medianas: 2 items por fila
              md: "repeat(3, 1fr)", // pantallas grandes: 3 items por fila
            },
          }}
      >
        {favourites
          ?.filter((value) => value._id)
          .map((card, index) => {
            const isNew = index >= previousLength;
            const animationIndex = isNew ? index - previousLength : 0;
            return (
              <Zoom
                key={card._id}
                in={true}
                timeout={300}
                style={{
                  transitionDelay: isNew ? `${animationIndex * 100}ms` : "0ms",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    border: 1,
                    borderRadius: 2,
                    minWidth: "220px", // Minimum width
                    maxWidth: "500px", // Maximum width
                    minHeight: "280px", // Minimum height
                    maxHeight: "620px", // Maximum height
                  }}
                >
                  <img src={card?.image} alt={card.title} width="100%" />
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setIdReceta(card?._id);
                        window.history.replaceState(
                          "",
                          "",
                          `/main/p/${card._id}`
                        );
                        setOpenReceta(true);
                      }}
                    >
                      open me
                    </Button>
                    <Checkbox
                      defaultChecked
                      color="success"
                      checked={idSelected.includes(card._id)}
                      onChange={(e) => {
                        var result = [];
                        e.target.checked
                          ? (result = [...idSelected, card._id])
                          : (result = idSelected.filter(
                              (favourite) => favourite != card._id
                            ));

                        setidSelected(result);
                      }}
                    />
                  </div>
                  <h2>{card.titulo}</h2>
                  <p>{card.descripcion}</p>
                  <p>{card._id}</p>
                </Box>
              </Zoom>
            );
          })}
        {favourites?.favourite?.filter((value) => value._id).length == 0 ? (
          <h4>Not Favourites Added</h4>
        ) : (
          <></>
        )}
      </Box>
      {openReceta ? (
        <Modal
          open={openReceta}
          closeAfterTransition
          BackdropProps={{
            timeout: 500,
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DetailsReceta
            isFull={false}
            isFromProfile={false}
            origen={"shippingList"}
            idReceta={idReceta}
            setOpen={setOpenReceta}
            idUser={userId}
          />
        </Modal>
      ) : (
        <></>
      )}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
      >
        <Button color="success" variant="contained">
          Generate list
        </Button>
      </div>
    </div>
  );
};
