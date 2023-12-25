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
} from "@chakra-ui/react";
import usePageTitle from "hooks/usePageTitle";
import { motion } from "framer-motion";

const HeaderDashboard = () => {
    const { pageTitle } = usePageTitle();
    return (
        <Flex
            as={motion.header}
            initial={{ translateY: -10, opacity: 0 }}
            animate={{
                translateY: 0,
                opacity: 1,
                transition: { duration: 0.5 },
            }}
            align="center"
            justify="space-between"
            p="4"
            bg="purple.700"
            color="white"
            boxShadow={"0px 0px 10px 0px rgba(0,0,0,0.45)"}
        >
            <Heading as="h1" fontSize="xl">
                {pageTitle}
            </Heading>
            <Flex align="center" flexDirection={"row-reverse"}>
                <Menu>
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
                            name={"ucef"}
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
                            {"user.name"}
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
                    </MenuList>
                </Menu>

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
                    mr="2"
                    textTransform={"capitalize"}
                >
                    {"youcef"}
                </Box>
            </Flex>
        </Flex>
    );
};

export default HeaderDashboard;
