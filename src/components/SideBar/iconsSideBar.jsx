import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import ExposureIcon from "@mui/icons-material/Exposure";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PostAddIcon from "@mui/icons-material/PostAdd";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import QueueIcon from "@mui/icons-material/Queue";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Icons = ({ idMenu, idSubMenu }) => {
  if (idMenu) {
    switch (idMenu) {
      case 1:
        return <PersonIcon fontSize="large" color="primary" />;
      case 2:
        return <SearchIcon fontSize="large" color="primary" />;
      case 3:
        return <RestaurantIcon fontSize="large" color="primary" />;
      case 4:
        return <ShoppingCartIcon fontSize="large" color="primary" />;
      default:
        return <QuestionMarkIcon />;
    }
  } else {
    switch (idSubMenu) {
      case 1:
        return <QueueIcon />;
      case 2:
        return <ExposureIcon />;
      case 3:
        return <CreateNewFolderIcon />;
      case 4:
        return <FactCheckIcon />;
      case 5:
        return <ManageSearchIcon />;
      case 6:
        return <PostAddIcon />;
      case 7:
        return <PersonAddAlt1Icon />;
      case 8:
        return <ManageAccountsIcon />;
      default:
        return <QuestionMarkIcon />;
    }
  }
};

export { Icons };
