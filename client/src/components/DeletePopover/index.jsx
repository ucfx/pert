import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverArrow,
    PopoverCloseButton,
    PopoverBody,
    PopoverFooter,
    ButtonGroup,
    Button,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import axios from "axios";
const DeletePopover = ({ projectId, updateData, onDelete }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const navigate = useNavigate();
    const handleDeleteProject = async () => {
        console.log("handleDeleteProject");
        onClose();
        const {
            data: { projects },
        } = await axios.delete(`/api/projects/${projectId}`);

        console.log(projects);
        if (onDelete) {
            console.log("ondelete is defined");
            onDelete();
        }
        if (updateData) {
            console.log("updateData is defined");
            setTimeout(() => {
                updateData(projects);
            }, 500);
        } else {
            navigate(-1);
        }
    };
    return (
        <Popover
            returnFocusOnClose={true}
            isOpen={isOpen}
            onClose={onClose}
            placement="bottom"
            closeOnBlur={true}
        >
            <PopoverTrigger>
                <motion.i
                    initial={{
                        opacity: 0,
                        translateY: 10,
                    }}
                    animate={{
                        opacity: 1,
                        translateY: 0,
                        transition: {
                            duration: 0.5,
                            delay: 0.3,
                        },
                    }}
                    exit={{ opacity: 0, translateY: -10 }}
                    onClick={onOpen}
                    whileHover={{
                        color: "#b74a42",
                        transition: {
                            duration: 0.2,
                        },
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="fa-regular fa-trash-alt trash-icon"
                ></motion.i>
            </PopoverTrigger>
            <PopoverContent
                bg={"purple.50"}
                boxShadow={"0px 0px 10px 0px rgba(0,0,0,0.45)"}
            >
                <PopoverHeader fontWeight="semibold" borderColor={"purple.300"}>
                    Confirmation
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                    Are you sure you want to continue with your action?
                    <span className="warning-message">
                        You cannot undo this action afterwards!
                    </span>
                </PopoverBody>
                <PopoverFooter
                    display="flex"
                    justifyContent="flex-end"
                    borderColor={"purple.100"}
                >
                    <ButtonGroup size="sm">
                        <Button
                            bg={"purple.100"}
                            onClick={onClose}
                            variant="outline"
                            _hover={{
                                bg: "purple.200",
                                transition: {
                                    duration: 0.2,
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteProject} colorScheme="red">
                            Apply
                        </Button>
                    </ButtonGroup>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
};

export default DeletePopover;
