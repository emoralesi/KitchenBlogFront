import CategoryIcon from '@mui/icons-material/Category';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ExposureIcon from '@mui/icons-material/Exposure';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import InventoryIcon from '@mui/icons-material/Inventory';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PostAddIcon from '@mui/icons-material/PostAdd';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import QueueIcon from '@mui/icons-material/Queue';
import ShopTwoIcon from '@mui/icons-material/ShopTwo';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const Icons = ({ idMenu, idSubMenu }) => {
    if (idMenu) {
        switch (idMenu) {
            case 1:
                return <ShopTwoIcon />
            case 2:
                return <CategoryIcon />
            case 3:
                return <InventoryIcon />
            case 4:
                return <AssignmentIndIcon />
            default:
                return <QuestionMarkIcon />
        }
    } else {
        switch (idSubMenu) {
            case 1:
                return <QueueIcon />
            case 2:
                return <ExposureIcon />
            case 3:
                return <CreateNewFolderIcon />
            case 4:
                return <FactCheckIcon />
            case 5:
                return <ManageSearchIcon />
            case 6:
                return <PostAddIcon />
            case 7:
                return <PersonAddAlt1Icon />
            case 8:
                return <ManageAccountsIcon />
            default:
                return <QuestionMarkIcon />
        }
    }

}

export { Icons };

