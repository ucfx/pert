import "./style.css";
import { NavLink } from "react-router-dom";
import {
    Flex,
    Box,
    Heading,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    SkeletonCircle,
    SkeletonText,
    Button,
    useToast,
} from "@chakra-ui/react";
import usePageTitle from "hooks/usePageTitle";
import { motion } from "framer-motion";
import useLogout from "hooks/useLogout";

const HeaderDashboard = ({ user, loading }) => {
    const { pageTitle } = usePageTitle();
    const { logout } = useLogout();
    const toast = useToast({ position: "top", isClosable: true });
    const handleLogout = () => {
        toast.closeAll();
        toast.promise(logout(), {
            loading: {
                title: "Logging out...",
                description: "Please wait.",
            },
            success: () => {
                return {
                    title: "Logged out successfully.",
                    description: "See you next time!",
                    duration: 1500,
                    colorScheme: "purple",
                };
            },
            error: () => {
                return {
                    title: "An error occurred.",
                    description: "Something went wrong!",
                    duration: 3000,
                };
            },
        });
    };
    return (
        <Flex
          //as={motion.header}
          // initial={{ opacity: 0 }}
          //  animate={{
          //     opacity: 1,
          //    transition: { duration: 0.5 },
          // }}
            align="center"
            justify="space-between"
            p="4"
            bg="purple.700"
            color="white"
            boxShadow={"0px 0px 10px 0px rgba(0,0,0,0.45)"}
            pos={"relative"}
            zIndex="99"
        >
            <Box>
                {pageTitle && (
                    <Heading
                        as={motion.h1}
                        initial={{
                            translateX: -10,
                            opacity: 0,
                        }}
                        animate={{
                            translateX: 0,
                            opacity: 1,
                            transition: { delay: 0.2 },
                        }}
                        fontSize="xl"
                        size="lg"
                    >
                        {pageTitle}
                    </Heading>
                )}
            </Box>
            <Flex align="center" flexDirection={"row-reverse"}>
                <Menu>
                    <SkeletonCircle size="8" isLoaded={!loading}>
                        <MenuButton as={Box} cursor="pointer">
                            <Avatar
                                as={motion.div}
                                initial={{
                                    translateX: -10,
                                    opacity: 0,
                                }}
                                animate={{
                                    translateX: 0,
                                    opacity: 1,
                                    transition: { delay: 0.5 },
                                }}
                                size="sm"
                                name={
                                    (user && user.name) ||
                                    (user && user.username)
                                }
                            />
                        </MenuButton>
                        <MenuList
                            color={"black"}
                            boxShadow={"0px 0px 10px 0px rgba(0,0,0,0.45)"}
                        >
                            <Heading
                                as="h6"
                                size="xs"
                                px="4"
                                py="2"
                                color={"gray.500"}
                            >
                                {(user && user.username) || "username"}
                            </Heading>
                            <MenuDivider
                                borderColor={"gray.300"}
                                borderWidth={"3px"}
                            />
                            <MenuItem
                                as={NavLink}
                                to={"projects"}
                                position="relative"
                            >
                                Project
                            </MenuItem>
                            <MenuItem
                                as={NavLink}
                                to={"settings"}
                                position="relative"
                            >
                                Settings
                            </MenuItem>
                            <MenuDivider
                                borderColor={"gray.300"}
                                borderWidth={"3px"}
                            />
                            <MenuItem
                                as={Button}
                                position="relative"
                                w={"90%"}
                                m={"0 auto"}
                                onClick={handleLogout}
                                _focus={{
                                    outline: "none",
                                    boxShadow: "none",
                                }}
                            >
                                Logout
                            </MenuItem>
                        </MenuList>
                    </SkeletonCircle>
                </Menu>
                <SkeletonText
                    skeletonHeight="2"
                    w={loading ? "90px" : "fit-content"}
                    isLoaded={!loading}
                    noOfLines={1}
                    textAlign={"right"}
                    mr="2"
                >
                    <Box
                        as={motion.div}
                        initial={{
                            translateX: -10,
                            opacity: 0,
                        }}
                        animate={{
                            translateX: 0,
                            opacity: 1,
                            transition: { delay: 0.2 },
                        }}
                        textTransform={"capitalize"}
                    >
                        {user && user.username}
                    </Box>
                </SkeletonText>
            </Flex>
        </Flex>
    );
};

export default HeaderDashboard;
