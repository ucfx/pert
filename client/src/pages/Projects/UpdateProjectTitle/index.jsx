import React from "react";
import { useForm } from "react-hook-form";
import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    Input,
    FormControl,
    FormLabel,
    useDisclosure,
    Text,
    useToast,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlinePencilAlt } from "react-icons/hi";
import axios from "axios";

const UpdateProjectTitle = ({ project, updateData, currentTitle }) => {
    const {
        register: projectRegister,
        handleSubmit,
        clearErrors,
        setError,
        formState: { errors },
        reset,
    } = useForm();
    const toast = useToast({
        position: "top-right",
        isClosable: true,
    });

    const { onOpen, onClose, isOpen } = useDisclosure();

    const updateTitle = async (data) => {
        if (data.title === currentTitle) {
            onClose();
            reset();
            console.log("same title");
            return;
        }
        const postData = (data) => {
            return new Promise((resolve, reject) => {
                axios
                    .put(`/api/projects/${project._id}`, data)
                    .then(({ data: { project } }) => {
                        updateData(project);
                        onClose();
                        reset();
                        resolve();
                    })
                    .catch((err) => {
                        console.log(err);
                        setError("title", {
                            type: "manual",
                            message: err.response.data.message,
                        });
                        reject();
                    });
            });
        };

        toast.closeAll();
        toast.promise(postData(data), {
            loading: {
                title: "Creating project...",
                description: "Please wait.",
            },
            success: () => {
                reset();
                return {
                    title: "Success!",
                    description: "Title updated successfully.",
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

    const onError = (errors) => {
        console.log(errors);
    };

    const validateTitle = (value) => {
        if (value.trim() !== "" && !isNaN(value.trim().charAt(0))) {
            return "Must start with a letter";
        }

        if (value !== "" && !/^[a-zA-Z0-9]*$/.test(value)) {
            return "Title must contain only characters and numbers";
        }

        return true;
    };

    return (
        <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
                <Button
                    p={0}
                    ml={1}
                    _focus={{
                        outline: "none",
                        boxShadow: "none",
                    }}
                    className={"hint-message"}
                    _after={{
                        content: '"Edit title"',
                        top: "45px",
                    }}
                    _hover={{
                        bg: "purple.100",
                    }}
                >
                    <HiOutlinePencilAlt className="pencil-icon" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                m={4}
                mt={0}
                p={4}
                boxShadow={
                    "0 0 5px 0 rgba(0,0,0,0.5), 0 0 20px 0 rgba(0,0,0,0.2)"
                }
            >
                <PopoverBody>
                    <form onSubmit={handleSubmit(updateTitle, onError)}>
                        <FormControl>
                            <FormLabel>Title:</FormLabel>
                            <Input
                                {...projectRegister("title", {
                                    required: {
                                        value: true,
                                        message: "Will not be empty",
                                    },
                                    onChange: (e) => {
                                        if (e.target.value === "") return;
                                        const verefy = validateTitle(
                                            e.target.value
                                        );
                                        if (verefy !== true) {
                                            setError("title", {
                                                type: "manual",
                                                message: verefy,
                                            });
                                        } else {
                                            clearErrors("title");
                                        }
                                    },
                                    validate: validateTitle,
                                })}
                                type="text"
                                placeholder="Enter project title"
                                focusBorderColor="purple.500"
                                borderColor={"purple.200"}
                                _hover={{
                                    borderColor: "purple.300",
                                }}
                            />
                            <AnimatePresence>
                                {errors.title && (
                                    <Text
                                        as={motion.p}
                                        display="block"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{
                                            opacity: 1,
                                            height: "fit-content",
                                        }}
                                        exit={{ opacity: 0, height: 0 }}
                                        fontSize="md"
                                        color="red.400"
                                    >
                                        {errors.title.message}
                                    </Text>
                                )}
                            </AnimatePresence>
                        </FormControl>
                        <Button mt={4} colorScheme="purple" type="submit">
                            Save
                        </Button>
                    </form>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

export default UpdateProjectTitle;
